import { Request, Response, NextFunction } from 'express';
import { Folder } from '../models/Folder';
import { File } from '../models/File';

export const getProjectFolders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const folders = await Folder.find({ projectId: req.params.id });
    res.json({ success: true, data: folders });
  } catch (error) {
    next(error);
  }
};

export const createFolder = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id: projectId } = req.params;
    const folder = await Folder.create({
      ...req.body,
      projectId,
      createdBy: req.user._id
    });
    res.status(201).json({ success: true, data: folder });
  } catch (error) {
    next(error);
  }
};

export const updateFolder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const folder = await Folder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!folder) return res.status(404).json({ success: false, error: 'Folder not found' });
    res.json({ success: true, data: folder });
  } catch (error) {
    next(error);
  }
};

export const deleteFolder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const folderId = req.params.id;
    
    // Check if folder is empty (simplified for now, usually you'd want to delete recursively)
    const hasFiles = await File.exists({ folderId });
    const hasSubfolders = await Folder.exists({ parentId: folderId });
    
    if (hasFiles || hasSubfolders) {
      return res.status(400).json({ success: false, error: 'Folder is not empty' });
    }

    await Folder.findByIdAndDelete(folderId);
    res.json({ success: true, message: 'Folder deleted' });
  } catch (error) {
    next(error);
  }
};
