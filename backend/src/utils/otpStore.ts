/**
 * In-memory OTP store with automatic TTL eviction.
 * Acts as a lightweight Redis replacement without extra infrastructure.
 * Each record is purged exactly when its TTL expires, keeping memory clean.
 */

import crypto from 'crypto';

interface OTPRecord {
  otp: string;       // 6-digit code (hashed with SHA-256)
  attempts: number;  // wrong-guess counter
  expiresAt: number; // unix ms timestamp
}

// email → OTPRecord
const store = new Map<string, OTPRecord>();

// Housekeeping: sweep expired records every 2 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (record.expiresAt < now) store.delete(key);
  }
}, 2 * 60 * 1000);

/** Cryptographically secure 6-digit OTP */
export function generateOTP(): string {
  // randomInt(0, 1_000_000) → 0..999999, zero-padded to 6 digits
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
}

/** Hash the raw OTP before storing (defence-in-depth) */
function hashOTP(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

/** Persist an OTP; TTL defaults to 10 minutes */
export function storeOTP(email: string, otp: string, ttlMs = 10 * 60 * 1000): void {
  store.set(email.toLowerCase(), {
    otp: hashOTP(otp),
    attempts: 0,
    expiresAt: Date.now() + ttlMs,
  });
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: 'NOT_FOUND' | 'EXPIRED' | 'INVALID' | 'TOO_MANY_ATTEMPTS' };

/** Verify a raw OTP, consuming it on success */
export function verifyOTP(email: string, rawOTP: string): VerifyResult {
  const key = email.toLowerCase();
  const record = store.get(key);

  if (!record) return { ok: false, reason: 'NOT_FOUND' };
  if (Date.now() > record.expiresAt) {
    store.delete(key);
    return { ok: false, reason: 'EXPIRED' };
  }
  if (record.attempts >= 5) {
    store.delete(key);
    return { ok: false, reason: 'TOO_MANY_ATTEMPTS' };
  }

  if (hashOTP(rawOTP) !== record.otp) {
    record.attempts += 1;
    return { ok: false, reason: 'INVALID' };
  }

  // Consumed — one-time use
  store.delete(key);
  return { ok: true };
}

/** How many seconds remain before an OTP expires (for frontend countdown) */
export function getOTPTTL(email: string): number {
  const record = store.get(email.toLowerCase());
  if (!record) return 0;
  return Math.max(0, Math.ceil((record.expiresAt - Date.now()) / 1000));
}

/** Check whether a pending OTP exists (for rate-limiting sends) */
export function hasPendingOTP(email: string): boolean {
  const record = store.get(email.toLowerCase());
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    store.delete(email.toLowerCase());
    return false;
  }
  return true;
}
