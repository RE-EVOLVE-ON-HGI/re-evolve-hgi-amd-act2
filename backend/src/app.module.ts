import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

import configuration from './common/config/configuration';
import { PrismaModule } from './common/prisma/prisma.module';
import { KafkaModule } from './common/kafka/kafka.module';
import { RedisModule } from './common/redis/redis.module';
import { AuthModule } from './common/auth/auth.module';
import { RealtimeModule } from './realtime/realtime.module';

import { AgentsModule } from './modules/agents/agents.module';
import { MemoryModule } from './modules/memory/memory.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { TelemetryModule } from './modules/telemetry/telemetry.module';
import { GovernanceModule } from './modules/governance/governance.module';
import { SimulationModule } from './modules/simulation/simulation.module';
import { ModelModule } from './modules/model/model.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: [join(process.cwd(), 'src', '**', '*.graphql')],
      playground: true,
    }),
    // infrastructure
    PrismaModule, KafkaModule, RedisModule, AuthModule, RealtimeModule, ModelModule,
    // domain modules (fully implemented reference set)
    AgentsModule, MemoryModule, WorkflowsModule, TelemetryModule, GovernanceModule, SimulationModule,
    // ── remaining wireframe modules attach here, identical pattern ──
    // KnowledgeGraphModule, EcosystemModule, IntelligenceEconomyModule,
    // QuantumSimModule, InfraAtlasModule, MultiRegionModule, SecurityModule,
    // ApiObservabilityModule, DataPipelineModule, NeuralCoreModule,
    // FinancialModule, FounderCockpitModule
  ],
})
export class AppModule {}
