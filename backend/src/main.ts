import { initTelemetry } from './common/telemetry/otel';
initTelemetry(); // must run before anything else is imported/instrumented

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { KafkaService } from './common/kafka/kafka.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();

  // OpenAPI / Swagger
  const swagger = new DocumentBuilder()
    .setTitle('RE-EVOLVE ON HGI API')
    .setDescription('Adaptive Intelligence Operating System')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swagger));

  // gRPC microservice transport for internal service-to-service calls
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'hgi',
      protoPath: join(__dirname, '..', 'proto', 'hgi.proto'),
      url: `0.0.0.0:${process.env.GRPC_PORT ?? 50051}`,
    },
  });

  await app.startAllMicroservices();

  // start Kafka consumer loop once all subscriptions are registered
  await app.get(KafkaService).run();

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  new Logger('Bootstrap').log(`HGI backend listening on :${port} (REST /docs, GraphQL /graphql, gRPC :${process.env.GRPC_PORT})`);
}
bootstrap();
