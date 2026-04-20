import { Request, Response, NextFunction } from 'express';
import { File } from '../models/File';
import path from 'path';
import fs from 'fs';

export const getProjectFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { folderId } = req.query;
    const query: any = { projectId: req.params.id };
    if (folderId) query.folderId = folderId === 'root' ? null : folderId;
    
    // Only get latest versions by default (simplified logic)
    const files = await File.find(query).populate('uploaderId', 'name avatarUrl');
    res.json({ success: true, data: files });
  } catch (error) {
    next(error);
  }
};

export const uploadFile = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });

    const { id: projectId } = req.params;
    const { folderId, accessRoles } = req.body;

    const file = await File.create({
      projectId,
      folderId: folderId || null,
      uploaderId: req.user._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      sizeBytes: req.file.size,
      storagePath: req.file.path,
      accessRoles: accessRoles ? JSON.parse(accessRoles) : undefined
    });

    res.status(201).json({ success: true, data: file });
  } catch (error) {
    next(error);
  }
};

export const downloadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ success: false, error: 'File not found' });

    const absolutePath = path.resolve(file.storagePath);
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ success: false, error: 'Physical file not found' });
    }

    res.download(absolutePath, file.originalName);
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ success: false, error: 'File not found' });

    // Delete physical file
    if (fs.existsSync(file.storagePath)) {
      fs.unlinkSync(file.storagePath);
    }

    await File.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'File deleted' });
  } catch (error) {
    next(error);
  }
};
