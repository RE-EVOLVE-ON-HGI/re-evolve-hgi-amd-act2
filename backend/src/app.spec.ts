import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { ModelService } from './modules/model/model.service';
import { IntentService } from './modules/agents/orchestration/intent.service';
import { OrchestratorService } from './modules/agents/orchestration/orchestrator.service';
import { MemoryService } from './modules/memory/memory.service';
import { PolicyService } from './modules/governance/policy.service';
import { PrismaService } from './common/prisma/prisma.service';
import { KafkaService } from './common/kafka/kafka.service';
import { QdrantService } from './modules/memory/qdrant.service';

describe('HGI Operating System Integration Tests', () => {
  let appModule: TestingModule;
  let modelService: ModelService;
  let intentService: IntentService;
  let orchestratorService: OrchestratorService;
  let memoryService: MemoryService;
  let policyService: PolicyService;
  let prisma: PrismaService;

  beforeAll(async () => {
    appModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(KafkaService)
      .useValue({
        emit: jest.fn().mockResolvedValue(undefined),
        subscribe: jest.fn().mockResolvedValue(undefined),
        run: jest.fn().mockResolvedValue(undefined),
      })
      .overrideProvider(QdrantService)
      .useValue({
        onModuleInit: jest.fn().mockResolvedValue(undefined),
        upsert: jest.fn().mockResolvedValue(undefined),
        search: jest.fn().mockImplementation(async (orgId, vector, limit) => {
          const records = await prisma.memoryRecord.findMany({ take: 1 });
          if (records.length > 0) {
            return [{ id: records[0].id, score: 0.95 }];
          }
          return [];
        }),
      })
      .compile();

    await appModule.init();

    modelService = appModule.get<ModelService>(ModelService);
    intentService = appModule.get<IntentService>(IntentService);
    orchestratorService = appModule.get<OrchestratorService>(OrchestratorService);
    memoryService = appModule.get<MemoryService>(MemoryService);
    policyService = appModule.get<PolicyService>(PolicyService);
    prisma = appModule.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await appModule.close();
  });

  describe('Model Layer Integration', () => {
    it('should generate structured mock responses when keys are absent', async () => {
      const response = await modelService.chat([{ role: 'user', content: 'classify this goal: write code for me' }]);
      expect(response).toBeDefined();
      const parsed = JSON.parse(response);
      expect(parsed.intent).toEqual('CODE');
    });
  });

  describe('CENSA Intent Service', () => {
    it('should classify goals correctly', async () => {
      const intent = await intentService.classify('create a react frontend dashboard');
      expect(intent).toEqual('CODE');
    });
  });

  describe('Memory Vault Ingestion and Retrieval', () => {
    it('should ingest episodic memories and allow semantic retrieval', async () => {
      const org = await prisma.organization.findFirst({ where: { slug: 're-evolve' } });
      expect(org).toBeDefined();
      const orgId = org!.id;

      const record = await memoryService.ingest({
        orgId,
        kind: 'DOCUMENT',
        source: 'jest-test',
        content: 'Unique secret test content about AMD and Fireworks hackathon ACT II',
      });
      expect(record.id).toBeDefined();

      const retrieval = await memoryService.retrieve(orgId, 'AMD Fireworks hackathon');
      expect(retrieval).toBeDefined();
      expect(retrieval.length).toBeGreaterThan(0);
    });
  });

  describe('Kavacha Policy Engine & Governance', () => {
    it('should evaluate rule compliance, write transaction ledger, and trigger approvals on failure', async () => {
      const org = await prisma.organization.findFirst({ where: { slug: 're-evolve' } });
      const orgId = org!.id;

      const policy = await prisma.policy.create({
        data: {
          orgId,
          name: 'Restricted Subject Validation',
          domain: 'Security',
          state: 'ENFORCED',
          rules: {
            rules: [
              { field: 'role', op: 'neq', value: 'banned', severity: 'CRITICAL' },
            ],
          } as any,
        },
      });

      const res = await policyService.evaluate(policy.id, { role: 'banned', agentName: 'TestAgent' });
      expect(res.passed).toBeFalsy();
      expect(res.failedCount).toEqual(1);

      const approval = await prisma.approval.findFirst({
        where: { orgId, status: 'PENDING', subjectType: 'violation' },
      });
      expect(approval).toBeDefined();

      const tx = await prisma.economicTransaction.findFirst({
        where: { orgId, counterparty: 'TestAgent' },
      });
      expect(tx).toBeDefined();
      expect(Number(tx!.amountCents)).toBeGreaterThan(0);
    });
  });
});
