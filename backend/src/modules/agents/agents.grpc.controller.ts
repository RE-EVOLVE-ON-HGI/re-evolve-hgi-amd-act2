import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OrchestratorService } from './orchestration/orchestrator.service';
import { PrismaService } from '@common/prisma/prisma.service';

interface DispatchRequest {
  orgId: string;
  goal: string;
  inputJson: string;
  priority: number;
}

interface DispatchReply {
  orchestrationId: string;
}

interface TaskRef {
  taskId: string;
}

interface TaskState {
  status: string;
  latencyMs: number;
}

@Controller()
export class AgentsGrpcController {
  constructor(
    private readonly orchestrator: OrchestratorService,
    private readonly prisma: PrismaService,
  ) {}

  @GrpcMethod('Orchestration', 'Dispatch')
  async dispatch(data: DispatchRequest): Promise<DispatchReply> {
    let input = {};
    try {
      input = JSON.parse(data.inputJson || '{}');
    } catch {}
    const orchestration = await this.orchestrator.dispatch(data.orgId, data.goal, input, data.priority || 5);
    return { orchestrationId: orchestration.id };
  }

  @GrpcMethod('Orchestration', 'TaskStatus')
  async taskStatus(data: TaskRef): Promise<TaskState> {
    const task = await this.prisma.agentTask.findUnique({
      where: { id: data.taskId },
    });
    return {
      status: task?.status || 'NOT_FOUND',
      latencyMs: task?.latencyMs || 0,
    };
  }
}
