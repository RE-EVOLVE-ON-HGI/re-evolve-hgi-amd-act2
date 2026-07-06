export default () => ({
  port: parseInt(process.env.PORT ?? '4000', 10),
  grpcPort: parseInt(process.env.GRPC_PORT ?? '50051', 10),
  database: { url: process.env.DATABASE_URL },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  },
  kafka: {
    brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
    clientId: process.env.KAFKA_CLIENT_ID ?? 'hgi-backend',
    groupId: process.env.KAFKA_GROUP_ID ?? 'hgi-core',
  },
  vector: {
    url: process.env.QDRANT_URL ?? 'http://localhost:6333',
    apiKey: process.env.QDRANT_API_KEY,
    embeddingsModel: process.env.EMBEDDINGS_MODEL ?? 'text-embedding-3-large',
    embeddingsApiKey: process.env.EMBEDDINGS_API_KEY,
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-me',
    accessTtl: parseInt(process.env.JWT_ACCESS_TTL ?? '900', 10),
    refreshTtl: parseInt(process.env.JWT_REFRESH_TTL ?? '2592000', 10),
  },
});
