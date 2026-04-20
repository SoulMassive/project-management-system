import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { loginSchema, registerSchema } from '../utils/validation';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const accessToken = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { name, email, password } = validatedData;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      passwordHash: password,
      role: 'Manager',
    });

    const accessToken = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, error: 'Refresh token required' });

    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

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

    res.json({
      success: true,
      data: { accessToken, refreshToken: newRefreshToken }
    });
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid refresh token' });
  }
};

export const me = async (req: any, res: Response, next: NextFunction) => {
  res.json({ success: true, data: req.user });
};
