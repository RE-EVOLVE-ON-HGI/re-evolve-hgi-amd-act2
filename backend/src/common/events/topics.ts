/** Canonical Kafka topics — the nervous system of HGI. */
export const Topics = {
  AgentTaskCreated: 'agent.task.created',
  AgentTaskCompleted: 'agent.task.completed',
  AgentMessage: 'agent.message',
  OrchestrationUpdated: 'orchestration.updated',
  WorkflowTriggered: 'workflow.triggered',
  WorkflowStepCompleted: 'workflow.step.completed',
  MemoryIngested: 'memory.ingested',
  PolicyViolation: 'governance.violation',
  ApprovalRequested: 'governance.approval.requested',
  TelemetryIngested: 'telemetry.ingested',
  AnomalyDetected: 'telemetry.anomaly',
  InfraStatusChanged: 'infra.status.changed',
  DecisionMade: 'neural.decision',
  EconomicTransaction: 'economy.transaction',
} as const;
export type Topic = (typeof Topics)[keyof typeof Topics];
