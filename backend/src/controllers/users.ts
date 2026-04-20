import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { ActivityLog } from '../models/ActivityLog';
import { userCreateSchema } from '../utils/validation';
import { paginate } from '../utils/paginate';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const result = await paginate(User, {}, { page, limit });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = userCreateSchema.parse(req.body);
    
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const user = await User.create({
      ...validatedData,
      passwordHash: validatedData.password // Schema pre-save hook will hash it
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove password from updates if empty
    if (updates.password === '') delete updates.password;
    if (updates.password) {
      updates.passwordHash = updates.password;
      delete updates.password;
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getActivityLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const result = await paginate(ActivityLog, {}, { page, limit });

    // Populate user info
    const populatedData = await ActivityLog.find({})
      .populate('userId', 'name email avatarUrl')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ 
      success: true, 
      data: populatedData,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};
