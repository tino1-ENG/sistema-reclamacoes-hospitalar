import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

export async function connectDatabase(): Promise<typeof mongoose> {
  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(env.DATABASE_URL);
    logger.info(`✅ Ligação à base de dados MongoDB estabelecida: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    logger.error({ err: error }, '❌ Erro ao ligar ao MongoDB em ' + env.DATABASE_URL);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info('Desconectado do MongoDB.');
}
