-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "OrgTier" AS ENUM ('GROWTH', 'SCALE', 'ENTERPRISE', 'SOVEREIGN');

-- CreateEnum
CREATE TYPE "OrgStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INVITED', 'DISABLED');

-- CreateEnum
CREATE TYPE "EcoStage" AS ENUM ('LAUNCH', 'GROWTH', 'SCALE', 'MATURE', 'TRANSCEND', 'EXITED');

-- CreateEnum
CREATE TYPE "AgentType" AS ENUM ('PLANNING', 'EXECUTION', 'ANALYTICS', 'GOVERNANCE', 'COMMUNICATION', 'LEARNING');

-- CreateEnum
CREATE TYPE "AgentTier" AS ENUM ('COUNCIL_PRIME', 'STRATEGIC', 'EXECUTION', 'SPECIALIST');

-- CreateEnum
CREATE TYPE "AgentStatus" AS ENUM ('ACTIVE', 'IDLE', 'TRAINING', 'ERROR', 'RETIRED');

-- CreateEnum
CREATE TYPE "TaskStage" AS ENUM ('INTAKE', 'ANALYZE', 'PLAN', 'EXECUTE', 'VALIDATE', 'DELIVER');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'RETRYING', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MemoryKind" AS ENUM ('CONVERSATION', 'DOCUMENT', 'CODE', 'EVENT', 'CONFIG', 'EPISODIC');

-- CreateEnum
CREATE TYPE "RetentionTier" AS ENUM ('HOT', 'WARM', 'COLD', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "PolicyState" AS ENUM ('DESIGN', 'REVIEW', 'PUBLISHED', 'ENFORCED', 'EVALUATED', 'RETIRED');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ViolationStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'MITIGATED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TelemetryKind" AS ENUM ('LOG', 'METRIC', 'TRACE', 'EVENT', 'ANOMALY');

-- CreateEnum
CREATE TYPE "InfraKind" AS ENUM ('CLOUD_REGION', 'COMPUTE_CLUSTER', 'AI_NODE', 'EDGE_DEPLOYMENT', 'DATABASE', 'CACHE', 'GPU_CLUSTER');

-- CreateEnum
CREATE TYPE "InfraStatus" AS ENUM ('HEALTHY', 'WARNING', 'CRITICAL', 'MAINTENANCE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "PipelineStatus" AS ENUM ('HEALTHY', 'WARNING', 'FAILED', 'IN_PROGRESS', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('OPEN', 'SOLD', 'LICENSED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "FlowDirection" AS ENUM ('INFLOW', 'OUTFLOW');

-- CreateEnum
CREATE TYPE "DecisionMode" AS ENUM ('AUTOMATED', 'ASSISTED', 'MANUAL');

-- CreateEnum
CREATE TYPE "DecisionOutcome" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGATIVE');

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tier" "OrgTier" NOT NULL DEFAULT 'GROWTH',
    "status" "OrgStatus" NOT NULL DEFAULT 'ACTIVE',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "passwordHash" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastSeenAt" TIMESTAMP(3),
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "attributes" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshHash" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hashedKey" TEXT NOT NULL,
    "scopes" TEXT[],
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ecosystems" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "vertical" TEXT NOT NULL,
    "evolutionLevel" INTEGER NOT NULL DEFAULT 1,
    "stage" "EcoStage" NOT NULL DEFAULT 'GROWTH',
    "arrCents" BIGINT NOT NULL DEFAULT 0,
    "healthScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ecosystems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ecosystem_metrics" (
    "id" TEXT NOT NULL,
    "ecosystemId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ecosystem_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agents" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AgentType" NOT NULL,
    "tier" "AgentTier" NOT NULL DEFAULT 'SPECIALIST',
    "model" TEXT NOT NULL DEFAULT 'claude-opus-4-8',
    "status" "AgentStatus" NOT NULL DEFAULT 'IDLE',
    "capacityPct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "version" TEXT NOT NULL DEFAULT 'v1.0.0',
    "config" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_tasks" (
    "id" TEXT NOT NULL,
    "agentId" TEXT,
    "orchestrationId" TEXT,
    "stage" "TaskStage" NOT NULL DEFAULT 'INTAKE',
    "status" "TaskStatus" NOT NULL DEFAULT 'QUEUED',
    "priority" INTEGER NOT NULL DEFAULT 5,
    "input" JSONB NOT NULL,
    "output" JSONB,
    "plan" JSONB,
    "reasoning" JSONB,
    "retries" INTEGER NOT NULL DEFAULT 0,
    "latencyMs" INTEGER,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_messages" (
    "id" TEXT NOT NULL,
    "fromAgentId" TEXT NOT NULL,
    "toAgentId" TEXT NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'a2a',
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_evaluations" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "groundedness" DOUBLE PRECISION NOT NULL,
    "helpfulness" DOUBLE PRECISION NOT NULL,
    "safety" DOUBLE PRECISION NOT NULL,
    "latencyMs" INTEGER NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orchestrations" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'RUNNING',
    "topology" JSONB NOT NULL DEFAULT '{}',
    "consensus" DOUBLE PRECISION,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "orchestrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memory_records" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "agentId" TEXT,
    "kind" "MemoryKind" NOT NULL,
    "source" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "summary" TEXT,
    "embedding" vector(1536),
    "vectorRef" TEXT,
    "tokens" INTEGER NOT NULL DEFAULT 0,
    "retention" "RetentionTier" NOT NULL DEFAULT 'WARM',
    "importance" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "lastAccess" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memory_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memory_chunks" (
    "id" TEXT NOT NULL,
    "memoryId" TEXT NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(1536),

    CONSTRAINT "memory_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "graph_nodes" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "props" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "graph_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "graph_edges" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "srcId" TEXT NOT NULL,
    "dstId" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "props" JSONB NOT NULL DEFAULT '{}',
    "ecosystemId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "graph_edges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policies" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "state" "PolicyState" NOT NULL DEFAULT 'DESIGN',
    "version" TEXT NOT NULL DEFAULT 'v1.0',
    "rules" JSONB NOT NULL,
    "effectiveness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policy_evaluations" (
    "id" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "subject" JSONB NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "detail" JSONB NOT NULL,
    "evaluatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "policy_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "violations" (
    "id" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "status" "ViolationStatus" NOT NULL DEFAULT 'OPEN',
    "detail" JSONB NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "violations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approvals" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "requesterId" TEXT,
    "approverId" TEXT,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "chain" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),

    CONSTRAINT "approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "before" JSONB,
    "after" JSONB,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflows" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT 'v1.0',
    "status" "WorkflowStatus" NOT NULL DEFAULT 'DRAFT',
    "graph" JSONB NOT NULL,
    "trigger" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_executions" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'RUNNING',
    "context" JSONB NOT NULL DEFAULT '{}',
    "steps" JSONB NOT NULL DEFAULT '[]',
    "error" TEXT,
    "durationMs" INTEGER,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "workflow_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telemetry_events" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "kind" "TelemetryKind" NOT NULL,
    "severity" "Severity" NOT NULL DEFAULT 'LOW',
    "payload" JSONB NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "telemetry_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metrics" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "scopeId" TEXT,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_traffic" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "apiPath" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "latencyMs" INTEGER NOT NULL,
    "consumer" TEXT,
    "region" TEXT,
    "throttled" BOOLEAN NOT NULL DEFAULT false,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_traffic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infra_nodes" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "kind" "InfraKind" NOT NULL,
    "region" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "status" "InfraStatus" NOT NULL DEFAULT 'HEALTHY',
    "healthScore" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "utilization" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "infra_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regions" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "online" BOOLEAN NOT NULL DEFAULT true,
    "availability" DOUBLE PRECISION NOT NULL DEFAULT 99.9,
    "latencyMs" INTEGER NOT NULL DEFAULT 0,
    "drStatus" TEXT NOT NULL DEFAULT 'ready',
    "rtoMinutes" INTEGER NOT NULL DEFAULT 15,
    "rpoMinutes" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pipelines" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "schedule" TEXT,
    "status" "PipelineStatus" NOT NULL DEFAULT 'HEALTHY',
    "freshnessPct" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pipelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pipeline_runs" (
    "id" TEXT NOT NULL,
    "pipelineId" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'RUNNING',
    "bytes" BIGINT NOT NULL DEFAULT 0,
    "durationMs" INTEGER,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "pipeline_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intelligence_assets" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "assetClass" TEXT NOT NULL,
    "valuationCents" BIGINT NOT NULL DEFAULT 0,
    "ownerId" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "intelligence_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_listings" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "priceCents" BIGINT NOT NULL,
    "status" "ListingStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "market_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "economic_transactions" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "listingId" TEXT,
    "kind" TEXT NOT NULL,
    "amountCents" BIGINT NOT NULL,
    "counterparty" TEXT,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "economic_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capital_flows" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "direction" "FlowDirection" NOT NULL,
    "amountCents" BIGINT NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "capital_flows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulations" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "qubits" INTEGER NOT NULL DEFAULT 0,
    "status" "TaskStatus" NOT NULL DEFAULT 'QUEUED',
    "params" JSONB NOT NULL DEFAULT '{}',
    "result" JSONB,
    "fidelity" DOUBLE PRECISION,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decisions" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "intent" TEXT NOT NULL,
    "mode" "DecisionMode" NOT NULL DEFAULT 'AUTOMATED',
    "impact" "Severity" NOT NULL DEFAULT 'MEDIUM',
    "outcome" "DecisionOutcome",
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "decidedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PermissionToRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE INDEX "organizations_status_tier_idx" ON "organizations"("status", "tier");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_orgId_status_idx" ON "users"("orgId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "roles_key_key" ON "roles"("key");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_key_key" ON "permissions"("key");

-- CreateIndex
CREATE INDEX "permissions_resource_action_idx" ON "permissions"("resource", "action");

-- CreateIndex
CREATE INDEX "sessions_userId_expiresAt_idx" ON "sessions"("userId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_hashedKey_key" ON "api_keys"("hashedKey");

-- CreateIndex
CREATE INDEX "api_keys_orgId_idx" ON "api_keys"("orgId");

-- CreateIndex
CREATE INDEX "ecosystems_orgId_vertical_stage_idx" ON "ecosystems"("orgId", "vertical", "stage");

-- CreateIndex
CREATE INDEX "ecosystem_metrics_ecosystemId_key_capturedAt_idx" ON "ecosystem_metrics"("ecosystemId", "key", "capturedAt");

-- CreateIndex
CREATE INDEX "agents_orgId_type_status_idx" ON "agents"("orgId", "type", "status");

-- CreateIndex
CREATE INDEX "agent_tasks_status_priority_createdAt_idx" ON "agent_tasks"("status", "priority", "createdAt");

-- CreateIndex
CREATE INDEX "agent_tasks_agentId_status_idx" ON "agent_tasks"("agentId", "status");

-- CreateIndex
CREATE INDEX "agent_messages_fromAgentId_createdAt_idx" ON "agent_messages"("fromAgentId", "createdAt");

-- CreateIndex
CREATE INDEX "agent_messages_toAgentId_createdAt_idx" ON "agent_messages"("toAgentId", "createdAt");

-- CreateIndex
CREATE INDEX "agent_evaluations_agentId_capturedAt_idx" ON "agent_evaluations"("agentId", "capturedAt");

-- CreateIndex
CREATE INDEX "orchestrations_orgId_status_idx" ON "orchestrations"("orgId", "status");

-- CreateIndex
CREATE INDEX "memory_records_orgId_kind_retention_idx" ON "memory_records"("orgId", "kind", "retention");

-- CreateIndex
CREATE INDEX "memory_records_agentId_createdAt_idx" ON "memory_records"("agentId", "createdAt");

-- CreateIndex
CREATE INDEX "memory_chunks_memoryId_ordinal_idx" ON "memory_chunks"("memoryId", "ordinal");

-- CreateIndex
CREATE INDEX "graph_nodes_orgId_type_idx" ON "graph_nodes"("orgId", "type");

-- CreateIndex
CREATE INDEX "graph_edges_orgId_relation_idx" ON "graph_edges"("orgId", "relation");

-- CreateIndex
CREATE INDEX "graph_edges_srcId_idx" ON "graph_edges"("srcId");

-- CreateIndex
CREATE INDEX "graph_edges_dstId_idx" ON "graph_edges"("dstId");

-- CreateIndex
CREATE INDEX "policies_orgId_domain_state_idx" ON "policies"("orgId", "domain", "state");

-- CreateIndex
CREATE INDEX "policy_evaluations_policyId_evaluatedAt_idx" ON "policy_evaluations"("policyId", "evaluatedAt");

-- CreateIndex
CREATE INDEX "violations_policyId_status_severity_idx" ON "violations"("policyId", "status", "severity");

-- CreateIndex
CREATE INDEX "approvals_orgId_status_idx" ON "approvals"("orgId", "status");

-- CreateIndex
CREATE INDEX "audit_logs_orgId_resource_createdAt_idx" ON "audit_logs"("orgId", "resource", "createdAt");

-- CreateIndex
CREATE INDEX "workflows_orgId_status_idx" ON "workflows"("orgId", "status");

-- CreateIndex
CREATE INDEX "workflow_executions_workflowId_status_startedAt_idx" ON "workflow_executions"("workflowId", "status", "startedAt");

-- CreateIndex
CREATE INDEX "telemetry_events_orgId_region_kind_ts_idx" ON "telemetry_events"("orgId", "region", "kind", "ts");

-- CreateIndex
CREATE INDEX "telemetry_events_service_ts_idx" ON "telemetry_events"("service", "ts");

-- CreateIndex
CREATE INDEX "metrics_orgId_name_scope_ts_idx" ON "metrics"("orgId", "name", "scope", "ts");

-- CreateIndex
CREATE INDEX "api_traffic_orgId_apiPath_ts_idx" ON "api_traffic"("orgId", "apiPath", "ts");

-- CreateIndex
CREATE INDEX "api_traffic_statusCode_ts_idx" ON "api_traffic"("statusCode", "ts");

-- CreateIndex
CREATE INDEX "infra_nodes_orgId_kind_region_status_idx" ON "infra_nodes"("orgId", "kind", "region", "status");

-- CreateIndex
CREATE UNIQUE INDEX "regions_orgId_code_key" ON "regions"("orgId", "code");

-- CreateIndex
CREATE INDEX "pipelines_orgId_status_idx" ON "pipelines"("orgId", "status");

-- CreateIndex
CREATE INDEX "pipeline_runs_pipelineId_status_startedAt_idx" ON "pipeline_runs"("pipelineId", "status", "startedAt");

-- CreateIndex
CREATE INDEX "intelligence_assets_orgId_assetClass_idx" ON "intelligence_assets"("orgId", "assetClass");

-- CreateIndex
CREATE INDEX "market_listings_assetId_status_idx" ON "market_listings"("assetId", "status");

-- CreateIndex
CREATE INDEX "economic_transactions_orgId_kind_ts_idx" ON "economic_transactions"("orgId", "kind", "ts");

-- CreateIndex
CREATE INDEX "capital_flows_orgId_category_ts_idx" ON "capital_flows"("orgId", "category", "ts");

-- CreateIndex
CREATE INDEX "simulations_orgId_domain_status_idx" ON "simulations"("orgId", "domain", "status");

-- CreateIndex
CREATE INDEX "decisions_orgId_mode_decidedAt_idx" ON "decisions"("orgId", "mode", "decidedAt");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionToRole_AB_unique" ON "_PermissionToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionToRole_B_index" ON "_PermissionToRole"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ecosystems" ADD CONSTRAINT "ecosystems_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ecosystem_metrics" ADD CONSTRAINT "ecosystem_metrics_ecosystemId_fkey" FOREIGN KEY ("ecosystemId") REFERENCES "ecosystems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_tasks" ADD CONSTRAINT "agent_tasks_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_tasks" ADD CONSTRAINT "agent_tasks_orchestrationId_fkey" FOREIGN KEY ("orchestrationId") REFERENCES "orchestrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_messages" ADD CONSTRAINT "agent_messages_fromAgentId_fkey" FOREIGN KEY ("fromAgentId") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_messages" ADD CONSTRAINT "agent_messages_toAgentId_fkey" FOREIGN KEY ("toAgentId") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_evaluations" ADD CONSTRAINT "agent_evaluations_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memory_records" ADD CONSTRAINT "memory_records_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memory_records" ADD CONSTRAINT "memory_records_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memory_chunks" ADD CONSTRAINT "memory_chunks_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "memory_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "graph_edges" ADD CONSTRAINT "graph_edges_srcId_fkey" FOREIGN KEY ("srcId") REFERENCES "graph_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "graph_edges" ADD CONSTRAINT "graph_edges_dstId_fkey" FOREIGN KEY ("dstId") REFERENCES "graph_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "graph_edges" ADD CONSTRAINT "graph_edges_ecosystemId_fkey" FOREIGN KEY ("ecosystemId") REFERENCES "ecosystems"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policies" ADD CONSTRAINT "policies_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_evaluations" ADD CONSTRAINT "policy_evaluations_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "violations" ADD CONSTRAINT "violations_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_executions" ADD CONSTRAINT "workflow_executions_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "infra_nodes" ADD CONSTRAINT "infra_nodes_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pipeline_runs" ADD CONSTRAINT "pipeline_runs_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "pipelines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_listings" ADD CONSTRAINT "market_listings_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "intelligence_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "economic_transactions" ADD CONSTRAINT "economic_transactions_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "market_listings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
