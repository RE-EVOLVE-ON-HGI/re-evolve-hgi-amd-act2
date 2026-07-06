import { IsEnum, IsOptional, IsString, IsObject } from 'class-validator';
import { AgentType, AgentTier } from '@prisma/client';

export class CreateAgentDto {
  @IsString() orgId!: string;
  @IsString() name!: string;
  @IsEnum(AgentType) type!: AgentType;
  @IsOptional() @IsEnum(AgentTier) tier?: AgentTier;
  @IsOptional() @IsString() model?: string;
  @IsOptional() @IsObject() config?: Record<string, unknown>;
}
