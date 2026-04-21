import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  login,
  register,
  logout,
  refresh,
  me,
  sendOtp,
  loginWithOtp,
  registerWithOtp,
} from '../controllers/auth';
import { protect } from '../middleware/protect';

const router = Router();

// ─── Rate Limiters ────────────────────────────────────────────────────────────

/** 5 OTP send requests per email per 15 minutes */
const otpSendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.body?.email || req.ip || 'unknown',
  message: { success: false, error: 'Too many OTP requests. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/** 10 OTP verify attempts per IP per 15 minutes (brute-force protection) */
const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many verification attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/** General login limiter: 20 attempts / 15 min */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Routes ───────────────────────────────────────────────────────────────────

// Password-based (backward-compat)
router.post('/login', loginLimiter, login);
router.post('/register', register);

// OTP-based
router.post('/send-otp', otpSendLimiter, sendOtp);
router.post('/login-otp', otpVerifyLimiter, loginWithOtp);
router.post('/register-otp', otpVerifyLimiter, registerWithOtp);

// Token management
router.post('/logout', protect, logout);
router.post('/refresh', refresh);
router.get('/me', protect, me);

export default router;
