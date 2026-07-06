import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { KafkaService } from '@common/kafka/kafka.service';
import { Topics } from '@common/events/topics';

type Rule = { field: string; op: 'eq' | 'neq' | 'gt' | 'lt' | 'in'; value: any; severity?: string };

/**
 * Declarative rule-evaluation engine. Policies hold a rule set; any subject
 * (agent action, workflow, transaction) is evaluated against them, producing
 * pass/fail, violations, and a governance score.
 */
@Injectable()
export class PolicyService {
  constructor(private prisma: PrismaService, private kafka: KafkaService) {}

  private check(rule: Rule, subject: Record<string, any>): boolean {
    const v = subject[rule.field];
    
    // Dynamic execution environment checks (Kavacha & Bumblebee-aligned)
    if (rule.field === 'sandboxCommand') {
      const isUnsafe = /curl|wget|npm install|pip install/.test(v || '');
      if (isUnsafe) {
        return false; // Blocks malicious downloads and supply-chain threats
      }
    }

    if (rule.field === 'agentSkills') {
      const skills = (v || []) as string[];
      if (skills.includes('unverified-skill')) {
        return false; // Blocks unverified static skills (SkillSpector-aligned)
      }
    }

    switch (rule.op) {
      case 'eq':  return v === rule.value;
      case 'neq': return v !== rule.value;
      case 'gt':  return v > rule.value;
      case 'lt':  return v < rule.value;
      case 'in':  return Array.isArray(rule.value) && rule.value.includes(v);
    }
    return true;
  }

  async evaluate(policyId: string, subject: Record<string, any>) {
    const policy = await this.prisma.policy.findUniqueOrThrow({ where: { id: policyId } });
    const rules = ((policy.rules as any)?.rules ?? []) as Rule[];
    const failed = rules.filter((r) => !this.check(r, subject));
    const passed = failed.length === 0;

    await this.prisma.policyEvaluation.create({
      data: { policyId, subject: subject as any, passed, detail: { failed } as any },
    });

    // 1. Audit Log Insertion
    await this.prisma.auditLog.create({
      data: {
        orgId: policy.orgId,
        action: 'policy:evaluate',
        resource: 'policy',
        resourceId: policyId,
        ip: '127.0.0.1',
        before: { subject } as any,
        after: { passed, failedCount: failed.length } as any,
      },
    });

    // 2. Billing/Transaction Cost tracking (concentric ledger billing)
    const baseCost = 5; // 5 cents
    const tokenInCost = Math.floor(Math.random() * 3) + 1; // 1-3 cents
    const tokenOutCost = Math.floor(Math.random() * 4) + 1; // 1-4 cents
    const totalCost = baseCost + tokenInCost + tokenOutCost;

    await this.prisma.economicTransaction.create({
      data: {
        orgId: policy.orgId,
        kind: 'deploy',
        amountCents: totalCost,
        counterparty: subject.agentName || 'AgentSpecialist',
      },
    });

    for (const f of failed) {
      const violation = await this.prisma.violation.create({
        data: {
          policyId,
          severity: (f.severity as any) ?? 'MEDIUM',
          detail: { rule: f, subject } as any,
        },
      });
      await this.kafka.emit(Topics.PolicyViolation, violation.id, { policyId, severity: violation.severity });

      // 3. Automated human approval triggers on violations
      const approval = await this.prisma.approval.create({
        data: {
          orgId: policy.orgId,
          subjectType: 'violation',
          subjectId: violation.id,
          status: 'PENDING',
          chain: [ { role: 'founder', level: 1 } ] as any,
        },
      });
      await this.kafka.emit(Topics.ApprovalRequested, approval.id, { orgId: policy.orgId, subjectId: violation.id });
    }
    return { passed, failedCount: failed.length };
  }

  /** Aggregate governance score across published policies. */
  async score(orgId: string) {
    const agg = await this.prisma.policy.aggregate({
      where: { orgId, state: 'ENFORCED' }, _avg: { effectiveness: true }, _count: true,
    });
    const openViolations = await this.prisma.violation.count({ where: { status: 'OPEN', policy: { orgId } } });
    return { effectiveness: agg._avg.effectiveness ?? 0, enforced: agg._count, openViolations };
  }
}
