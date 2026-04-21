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

  // ── SMTP (OTP email delivery) ────────────────────────────────────────────
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  // Coerce port to number (env vars are always strings)
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  // Coerce secure flag: "true" → true, anything else → false
  SMTP_SECURE: z.preprocess(
    (v) => v === 'true' || v === true,
    z.boolean()
  ).default(false),
  // Accept any non-empty string — validation happens at send time
  SMTP_USER: z.string().min(1, 'SMTP_USER is required'),
  SMTP_PASS: z.string().min(1, 'SMTP_PASS is required'),
});

const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
  console.error('❌ Invalid environment variables:');
  envServer.error.issues.forEach(issue => {
    console.error(`   ${issue.path.join('.')}: ${issue.message}`);
  });
  process.exit(1);
}

export const env = envServer.data;
