import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const resources = ['agents', 'memory', 'workflows', 'telemetry', 'governance'];
  const actions = ['read', 'write', 'create', 'execute', 'evaluate'];
  for (const r of resources) for (const a of actions) {
    await prisma.permission.upsert({
      where: { key: `${r}:${a}` },
      update: {},
      create: { key: `${r}:${a}`, resource: r, action: a },
    });
  }
  const allPerms = await prisma.permission.findMany();
  await prisma.role.upsert({
    where: { key: 'founder' },
    update: {},
    create: {
      key: 'founder', name: 'Founder',
      permissions: { connect: allPerms.map((p) => ({ id: p.id })) },
    },
  });
  const org = await prisma.organization.upsert({
    where: { slug: 're-evolve' },
    update: {},
    create: { slug: 're-evolve', name: 'RE-EVOLVE ON HGI', tier: 'SOVEREIGN' },
  });

  // Create default founder user for dashboard access
  const bcrypt = require('bcrypt');
  const passwordHash = bcrypt.hashSync('password', 10);
  const user = await prisma.user.upsert({
    where: { email: 'founder@re-evolve.ai' },
    update: {},
    create: {
      email: 'founder@re-evolve.ai',
      displayName: 'Founder',
      passwordHash,
      orgId: org.id,
      status: 'ACTIVE',
    },
  });

  const founderRole = await prisma.role.findUnique({ where: { key: 'founder' } });
  if (founderRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: founderRole.id } },
      update: {},
      create: { userId: user.id, roleId: founderRole.id },
    });
  }

  const agentCount = await prisma.agent.count({ where: { orgId: org.id } });
  if (agentCount === 0) {
    const mockAgents = [
      { name: 'MarketIntel-v2.3', type: 'PLANNING', model: 'claude-opus-4-8' },
      { name: 'DataSynth-Alpha', type: 'EXECUTION', model: 'gpt-4o' },
      { name: 'GovernanceAI-Core', type: 'GOVERNANCE', model: 'claude-sonnet-3-5' },
      { name: 'ContentGen-Beta', type: 'COMMUNICATION', model: 'gpt-4o-mini' },
      { name: 'Orchestrator-Prime', type: 'PLANNING', model: 'claude-opus-4-8' },
      { name: 'SecurityScan-v1.8', type: 'ANALYTICS', model: 'gpt-4o' },
    ];
    for (const a of mockAgents) {
      await prisma.agent.create({
        data: {
          name: a.name,
          type: a.type as any,
          orgId: org.id,
          status: 'IDLE',
          config: {},
        },
      });
    }
    console.log('seeded default agents');
  }
  console.log('seeded roles, permissions, founder org');
}
main().finally(() => prisma.$disconnect());
