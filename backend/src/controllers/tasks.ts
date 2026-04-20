import { Request, Response, NextFunction } from 'express';
import { Task } from '../models/Task';
import { Notification } from '../models/Notification';
import { taskCreateSchema } from '../utils/validation';
import mongoose from 'mongoose';

export const getProjectTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: projectId } = req.params;
    const { status, assignedTo } = req.query;

    const query: any = { projectId };
    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name avatarUrl')
      .sort({ createdAt: -1 });
      
    res.json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id: projectId } = req.params;
    const validatedData = taskCreateSchema.parse({ ...req.body, projectId });

    const task = await Task.create({
      ...validatedData,
      createdBy: req.user._id
    }) as any;

    // Create notifications for assigned users
    if (task.assignedTo && task.assignedTo.length > 0) {
      const notifications = task.assignedTo.map((userId: any) => ({
        userId,
        type: 'task_assigned',
        title: 'New Task Assigned',
        body: `You have been assigned to: ${task.title}`,
        entityType: 'Task',
        entityId: task._id
      }));
      await Notification.insertMany(notifications);
    }

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatarUrl')
      .populate('dependsOn', 'title status')
      .populate('comments.userId', 'name avatarUrl');
    
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const addSubtask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    
    task.subtasks.push(req.body);
    await task.save();
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const toggleSubtask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, sid } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });

    const subtask = task.subtasks.find(s => s._id?.toString() === sid);
    if (!subtask) return res.status(404).json({ success: false, error: 'Subtask not found' });

    subtask.isCompleted = !subtask.isCompleted;
    await task.save();
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req: any, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });

    task.comments.push({
      userId: req.user._id,
      content: req.body.content
    } as any);

    await task.save();
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};
