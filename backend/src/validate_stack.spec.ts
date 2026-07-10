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

describe('AI Execution Stack Zero-Trust Verification', () => {
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

  it('should run a complete mission with intent routing and governance', async () => {
    
    const goal = 'Design an Automotive Intelligence Platform';
    

    // 1. Intent Classification
    const intent = await intentService.classify(goal);
    

    // 2. Memory Retrieval
    const org = await prisma.organization.findFirst({ where: { slug: 're-evolve' } });
    const orgId = org ? org.id : 're-evolve-id';
    
    const context = await memoryService.retrieve(orgId, 'automotive platform specs');
    

    // 3. Model Inference (via active provider)
    
    const response = await modelService.chat(
      [{ role: 'user', content: `Analyze: ${goal}. Context: ${JSON.stringify(context)}` }],
      { complexity: 'complex' }
    );
    

    // 4. Kavacha Policy Check
    
    const policies = await prisma.policy.findMany({ where: { orgId } });
    if (policies.length > 0) {
      const evaluation = await policyService.evaluate(policies[0].id, {
        role: 'engineer',
        action: 'validate_blueprint',
        agentName: 'AutomotiveArchitect'
      });
      
    } else {
      
    }

    
  }, 180000);
});
