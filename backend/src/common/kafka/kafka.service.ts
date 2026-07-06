import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';

export type TopicHandler = (key: string, value: any, raw: EachMessagePayload) => Promise<void>;

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private handlers = new Map<string, TopicHandler[]>();

  constructor(private readonly config: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const cfg = this.config.get('kafka');
    this.kafka = new Kafka({ clientId: cfg.clientId, brokers: cfg.brokers });
    this.producer = this.kafka.producer({ allowAutoTopicCreation: true });
    this.consumer = this.kafka.consumer({ groupId: cfg.groupId });
    await this.producer.connect();
    await this.consumer.connect();
    this.logger.log(`Kafka connected (${cfg.brokers.join(',')})`);
  }

  /** Publish a domain event. */
  async emit(topic: string, key: string, value: unknown): Promise<void> {
    await this.producer.send({
      topic,
      messages: [{ key, value: JSON.stringify(value) }],
    });
  }

  /** Register a handler; subscription is (re)established on next start. */
  async subscribe(topic: string, handler: TopicHandler): Promise<void> {
    if (!this.handlers.has(topic)) {
      this.handlers.set(topic, []);
      await this.consumer.subscribe({ topic, fromBeginning: false });
    }
    this.handlers.get(topic)!.push(handler);
  }

  /** Call once after all subscriptions are registered (from AppModule bootstrap). */
  async run(): Promise<void> {
    await this.consumer.run({
      eachMessage: async (payload) => {
        const { topic, message } = payload;
        const value = message.value ? JSON.parse(message.value.toString()) : null;
        const key = message.key?.toString() ?? '';
        for (const h of this.handlers.get(topic) ?? []) {
          try { await h(key, value, payload); }
          catch (e) { this.logger.error(`handler failed for ${topic}: ${e}`); }
        }
      },
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.producer?.disconnect();
    await this.consumer?.disconnect();
  }
}
