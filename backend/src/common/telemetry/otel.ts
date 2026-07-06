import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

/** Boots distributed tracing before the Nest app. Call once in main.ts. */
export function initTelemetry(): void {
  const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({
      url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318'}/v1/traces`,
    }),
    instrumentations: [getNodeAutoInstrumentations()],
    serviceName: 'hgi-backend',
  });
  sdk.start();
  process.on('SIGTERM', () => sdk.shutdown());
}
