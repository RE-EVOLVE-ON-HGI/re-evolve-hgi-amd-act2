import { initTelemetry } from './common/telemetry/otel';
initTelemetry();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import type { Request, Response } from 'express';

let app: any;
let handler: (req: Request, res: Response) => Promise<void>;

async function createApp() {
  const nestApp = await NestFactory.create(AppModule);
  nestApp.setGlobalPrefix('api');
  nestApp.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  nestApp.enableCors();

  const swagger = new DocumentBuilder()
    .setTitle('RE-EVOLVE ON HGI API')
    .setDescription('Adaptive Intelligence Operating System')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', nestApp, SwaggerModule.createDocument(nestApp, swagger));

  await nestApp.init();
  app = nestApp.getHttpAdapter().getInstance();
  return app;
}

export default async function (req: Request, res: Response) {
  if (!app) {
    await createApp();
  }
  return app(req, res);
}