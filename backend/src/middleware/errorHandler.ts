import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    res.status(404).json({ success: false, error: message });
    return;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    res.status(400).json({ success: false, error: message });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message);
    res.status(400).json({ success: false, error: 'Validation Error', details: message });
    return;
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    details: env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
