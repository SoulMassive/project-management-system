import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const generateToken = (id: string) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
};

export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};
