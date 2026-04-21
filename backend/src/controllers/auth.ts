import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { loginSchema, registerSchema } from '../utils/validation';
import { generateOTP, storeOTP, verifyOTP, getOTPTTL, hasPendingOTP } from '../utils/otpStore';
import { sendOTPEmail } from '../utils/notifier';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildAuthResponse(user: any, accessToken: string, refreshToken: string) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    accessToken,
    refreshToken,
  };
}

// ─── OTP: Send ────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/send-otp
 * Body: { email, purpose: 'login' | 'register' }
 *
 * Rate-limit guard: if a valid OTP was sent < 60 s ago, return remaining TTL
 * so the frontend can show a "resend in Xs" countdown — no second email sent.
 */
export const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, purpose = 'login' } = req.body as {
      email: string;
      purpose?: 'login' | 'register';
    };

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const lowerEmail = email.toLowerCase().trim();

    // --- Throttle: one OTP per 60 s ---
    if (hasPendingOTP(lowerEmail)) {
      const ttl = getOTPTTL(lowerEmail);
      if (ttl > 540) {
        // OTP is still very fresh (> 9 min left) — do not spam
        return res.status(429).json({
          success: false,
          error: `Please wait ${Math.max(0, 60 - (600 - ttl))}s before requesting a new OTP`,
          ttlSeconds: ttl,
        });
      }
    }

    // --- For LOGIN: user must exist; for REGISTER: user must NOT exist ---
    if (purpose === 'login') {
      const user = await User.findOne({ email: lowerEmail });
      if (!user) {
        return res.status(404).json({ success: false, error: 'No account found with this email' });
      }
      if (!user.isActive) {
        return res.status(403).json({ success: false, error: 'Account is deactivated' });
      }
    } else {
      const exists = await User.findOne({ email: lowerEmail });
      if (exists) {
        return res.status(409).json({ success: false, error: 'An account with this email already exists' });
      }
    }

    // --- Generate, store, send ---
    const otp = generateOTP();
    storeOTP(lowerEmail, otp);              // 10-minute TTL
    const sent = await sendOTPEmail(lowerEmail, otp, purpose);

    if (!sent) {
      return res.status(500).json({ success: false, error: 'Failed to send OTP email. Try again.' });
    }

    return res.json({
      success: true,
      message: `OTP sent to ${lowerEmail}`,
      ttlSeconds: 600,
    });
  } catch (error) {
    next(error);
  }
};

// ─── OTP: Verify Login ────────────────────────────────────────────────────────

/**
 * POST /api/auth/login-otp
 * Body: { email, otp }
 * Verifies OTP then issues JWT pair — no password required.
 */
export const loginWithOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body as { email: string; otp: string };

    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'Email and OTP are required' });
    }

    const result = verifyOTP(email.toLowerCase().trim(), otp);

    if (!result.ok) {
      const messages: Record<string, string> = {
        NOT_FOUND: 'No OTP was requested for this email',
        EXPIRED: 'OTP has expired. Please request a new one',
        INVALID: 'Incorrect OTP. Please try again',
        TOO_MANY_ATTEMPTS: 'Too many incorrect attempts. Please request a new OTP',
      };
      return res.status(401).json({ success: false, error: messages[result.reason] });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, error: 'Account not found or deactivated' });
    }

    const accessToken = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    return res.json({
      success: true,
      data: buildAuthResponse(user, accessToken, refreshToken),
    });
  } catch (error) {
    next(error);
  }
};

// ─── OTP: Verify Register ─────────────────────────────────────────────────────

/**
 * POST /api/auth/register-otp
 * Body: { name, email, password, otp, company? }
 * Verifies OTP then creates the user account and returns JWT pair.
 */
export const registerWithOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, otp, company } = req.body;

    if (!otp) {
      return res.status(400).json({ success: false, error: 'OTP is required' });
    }

    // Validate the rest of the registration data with Zod
    const parsed = registerSchema.safeParse({ name, email, password, company });
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || 'Invalid input';
      return res.status(400).json({ success: false, error: msg });
    }

    const lowerEmail = parsed.data.email.toLowerCase().trim();

    // --- Check OTP ---
    const result = verifyOTP(lowerEmail, otp);
    if (!result.ok) {
      const messages: Record<string, string> = {
        NOT_FOUND: 'No OTP was requested for this email',
        EXPIRED: 'OTP has expired. Please request a new one',
        INVALID: 'Incorrect OTP. Please try again',
        TOO_MANY_ATTEMPTS: 'Too many incorrect attempts. Please request a new OTP',
      };
      return res.status(401).json({ success: false, error: messages[result.reason] });
    }

    // --- Guard: race condition check ---
    const existing = await User.findOne({ email: lowerEmail });
    if (existing) {
      return res.status(409).json({ success: false, error: 'Account already exists' });
    }

    // --- Create user ---
    const user = await User.create({
      name: parsed.data.name,
      email: lowerEmail,
      passwordHash: parsed.data.password,
      role: 'Manager', // default role
    });

    const accessToken = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    return res.status(201).json({
      success: true,
      data: buildAuthResponse(user, accessToken, refreshToken),
    });
  } catch (error) {
    next(error);
  }
};

// ─── Password-based Login (kept for backward compat) ─────────────────────────

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    if (!user.isActive) {
      return res.status(403).json({ success: false, error: 'Account is deactivated' });
    }

    const accessToken = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    return res.json({ success: true, data: buildAuthResponse(user, accessToken, refreshToken) });
  } catch (error) {
    next(error);
  }
};

// ─── Password-based Register (kept for backward compat) ──────────────────────

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { name, email, password } = validatedData;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const user = await User.create({ name, email, passwordHash: password, role: 'Manager' });

    const accessToken = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    return res.status(201).json({ success: true, data: buildAuthResponse(user, accessToken, refreshToken) });
  } catch (error) {
    next(error);
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────────

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, error: 'Refresh token required' });

    const user = await User.findOne({ refreshToken });
    if (user) { user.refreshToken = null; await user.save(); }

    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// ─── Refresh Token ────────────────────────────────────────────────────────────

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, error: 'Refresh token required' });

    const decoded: any = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, error: 'Invalid refresh token' });
    }

    const accessToken = generateToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = newRefreshToken;
    await user.save();

    return res.json({ success: true, data: { accessToken, refreshToken: newRefreshToken } });
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid refresh token' });
  }
};

// ─── Me ───────────────────────────────────────────────────────────────────────

export const me = async (req: any, res: Response) => {
  res.json({ success: true, data: req.user });
};
