import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  MONGO_URI: z.string().url(),
  JWT_SECRET: z.string().min(8),
  JWT_REFRESH_SECRET: z.string().min(8),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  UPLOAD_DIR: z.string().default('./uploads'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
  console.error('❌ Invalid environment variables:', envServer.error.format());
  process.exit(1);
}

export const env = envServer.data;
