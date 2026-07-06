import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { KafkaService } from '@common/kafka/kafka.service';
import { RealtimeGateway } from '../../realtime/realtime.gateway';
import { Topics } from '@common/events/topics';
import { TelemetryKind, Severity } from '@prisma/client';

/** Global Telemetry Grid — ingest, detect anomalies, aggregate, broadcast. */
@Injectable()
export class TelemetryService {
  constructor(
    private prisma: PrismaService,
    private kafka: KafkaService,
    private realtime: RealtimeGateway,
  ) {}

  async ingest(e: { orgId: string; region: string; service: string; kind: TelemetryKind; payload: any; severity?: Severity }) {
    const event = await this.prisma.telemetryEvent.create({
      data: { ...e, severity: e.severity ?? 'LOW' },
    });
    await this.kafka.emit(Topics.TelemetryIngested, event.id, { region: e.region, kind: e.kind });

    // simple threshold anomaly detector
    if (e.kind === 'METRIC' && typeof e.payload?.value === 'number' && e.payload.value > (e.payload.threshold ?? Infinity)) {
      await this.prisma.telemetryEvent.create({
        data: { orgId: e.orgId, region: e.region, service: e.service, kind: 'ANOMALY', severity: 'HIGH', payload: e.payload },
      });
      await this.kafka.emit(Topics.AnomalyDetected, event.id, e.payload);
      this.realtime.publish(e.orgId, 'telemetry', 'telemetry.anomaly', { region: e.region, service: e.service });
    }
    this.realtime.publish(e.orgId, 'telemetry', 'telemetry.event', { region: e.region, kind: e.kind });
    return event;
  }

  /** Region health rollup for the Global Telemetry / Infra Atlas maps. */
  async regionHealth(orgId: string) {
    return this.prisma.telemetryEvent.groupBy({
      by: ['region', 'severity'],
      where: { orgId, ts: { gte: new Date(Date.now() - 86_400_000) } },
      _count: true,
    });
  }
}
