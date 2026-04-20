import { Request, Response, NextFunction } from 'express';
import { Notification } from '../models/Notification';

export const getNotifications = async (req: any, res: Response, next: NextFunction) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!notification) return res.status(404).json({ success: false, error: 'Notification not found' });
    res.json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: any, res: Response, next: NextFunction) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};
