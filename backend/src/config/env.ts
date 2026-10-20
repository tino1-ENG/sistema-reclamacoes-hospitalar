import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform((v) => parseInt(v, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().default('mongodb://127.0.0.1:27017/hospitalcare'),
  JWT_SECRET: z.string().default('hospitalcare_secret_jwt_maputo_central_hospital_2026_super_secure'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().default('hospitalcare_refresh_secret_key_maputo_2026_super_secure'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:9000'),
  LOG_LEVEL: z.string().default('info')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Erro de validação das variáveis de ambiente:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
