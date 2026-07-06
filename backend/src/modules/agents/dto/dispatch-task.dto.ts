import { IsString, IsObject, IsOptional, IsInt, Min, Max } from 'class-validator';

export class DispatchTaskDto {
  @IsString() orgId!: string;
  @IsString() goal!: string;
  @IsObject() input!: Record<string, unknown>;
  @IsOptional() @IsInt() @Min(1) @Max(10) priority?: number;
}
