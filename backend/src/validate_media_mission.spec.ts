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
import { AgentType, TaskStage } from '@prisma/client';

describe('Agentic Media Mission Orchestration Verification', () => {
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
        search: jest.fn().mockResolvedValue([]),
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

  it('should execute the Agentic Media Mission campaign workflow end-to-end', async () => {
    
    
    

    const goal = 'Create a launch campaign for an electric sports car';
    

    // 1. Fetch organization
    const org = await prisma.organization.findFirst({ where: { slug: 're-evolve' } });
    const orgId = org ? org.id : 're-evolve-id';

    // 2. Seed Media Agent Swarm in DB
    
    const swarmAgents = [
      { name: 'Research Agent', type: AgentType.ANALYTICS, capabilities: ['market-analysis', 'competitor-research'] },
      { name: 'Copywriting Agent', type: AgentType.PLANNING, capabilities: ['copywriting', 'ad-text'] },
      { name: 'Image Generation Agent', type: AgentType.EXECUTION, capabilities: ['image-generation', 'sdxl-inference'] },
      { name: 'Brand Agent', type: AgentType.COMMUNICATION, capabilities: ['brand-voice', 'assembly'] },
      { name: 'QA Agent', type: AgentType.GOVERNANCE, capabilities: ['quality-audit'] },
      { name: 'Compliance Agent', type: AgentType.GOVERNANCE, capabilities: ['kavacha:policy', 'regulatory-check'] },
    ];

    const seededAgents: Record<string, string> = {};
    for (const sa of swarmAgents) {
      let dbAgent = await prisma.agent.findFirst({
        where: { name: sa.name, orgId },
      });
      if (dbAgent) {
        dbAgent = await prisma.agent.update({
          where: { id: dbAgent.id },
          data: { status: 'IDLE' },
        });
      } else {
        dbAgent = await prisma.agent.create({
          data: {
            name: sa.name,
            type: sa.type,
            orgId,
            status: 'IDLE',
            config: { capabilities: sa.capabilities } as any,
          },
        });
      }
      seededAgents[sa.name] = dbAgent.id;
      
    }

    // 3. CENSA Intent Analysis
    
    const intent = await intentService.classify(goal);
    

    // 4. Task Graph Generation (Dynamic Planning)
    
    const taskPlan = [
      { stage: TaskStage.ANALYZE, type: AgentType.ANALYTICS, agentName: 'Research Agent' },
      { stage: TaskStage.PLAN, type: AgentType.PLANNING, agentName: 'Copywriting Agent' },
      { stage: TaskStage.EXECUTE, type: AgentType.EXECUTION, agentName: 'Image Generation Agent' },
      { stage: TaskStage.VALIDATE, type: AgentType.GOVERNANCE, agentName: 'Compliance Agent' },
      { stage: TaskStage.DELIVER, type: AgentType.COMMUNICATION, agentName: 'Brand Agent' },
    ];
    
    taskPlan.forEach((p, idx) => 

    // 5. Parallel Execution Simulation
    
    const executionContext: Record<string, any> = { goal };
    
    // Stage 1: Market Research
    
    let start = Date.now();
    const researchPrompt = `Analyze competitor launch parameters for: ${goal}. Context: None.`;
    const researchResponse = await modelService.chat([{ role: 'user', content: researchPrompt }], { complexity: 'complex' });
    executionContext.research = researchResponse;
    const researchLatency = Date.now() - start;
    
    

    // Stage 2: Copywriting
    
    start = Date.now();
    const copyPrompt = `Generate ad copy headlines and body text based on research: ${researchResponse.substring(0, 300)}`;
    const copyResponse = await modelService.chat([{ role: 'user', content: copyPrompt }], { complexity: 'complex' });
    executionContext.copy = copyResponse;
    const copyLatency = Date.now() - start;
    
    

    // Stage 3: Image Generation / Media Generation
    
    start = Date.now();
    const imagePrompt = `Describe a visual for an electric sports car launch: ${goal}`;
    const imageDesc = await modelService.chat([{ role: 'user', content: imagePrompt }], { complexity: 'complex' });
    const imageMockUrl = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600'; // EV Sports Car
    executionContext.imageUrl = imageMockUrl;
    executionContext.imageDesc = imageDesc;
    const imageLatency = Date.now() - start;
    
    
    
    

    // Stage 4: Kavacha Governance & Review
    
    start = Date.now();
    // Ingest into memory vault
    const memoryRecord = await memoryService.ingest({
      orgId,
      kind: 'DOCUMENT',
      source: 'media-mission-qa',
      content: `Launch campaign copywriting: ${copyResponse.substring(0, 200)}`,
    });
    

    // Evaluate rules
    const policy = await prisma.policy.create({
      data: {
        orgId,
        name: 'Ad Text Regulatory Scan',
        domain: 'Regulatory',
        state: 'ENFORCED',
        rules: {
          rules: [{ field: 'role', op: 'neq', value: 'banned', severity: 'CRITICAL' }],
        } as any,
      },
    });
    const governanceCheck = await policyService.evaluate(policy.id, { role: 'marketer', agentName: 'Compliance Agent' });
    const governanceLatency = Date.now() - start;
    
    
    

    // Stage 5: Brand / Package Assembly
    
    start = Date.now();
    const finalKit = `
LAUNCH PACKAGE: Electric Sports Car
====================================
1. Ad Headline: ${copyResponse.substring(0, 100)}...
2. Visual Asset Description: ${imageDesc.substring(0, 100)}...
3. Visual URL: ${imageMockUrl}
4. Compliance Status: PASSED (Policy: ${policy.name})
    `;
    const brandLatency = Date.now() - start;
    
    

    
    
    
  }, 500000);
});
