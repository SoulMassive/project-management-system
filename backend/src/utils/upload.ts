import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { projectId } = req.params;
    const { folderId } = req.body;
    
    let uploadPath = env.UPLOAD_DIR;
    
    if (projectId) {
      uploadPath = path.join(uploadPath, projectId as string);
      const subFolder = (folderId as string) || 'root';
      uploadPath = path.join(uploadPath, subFolder);
    }
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Add file type restrictions here if needed
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});
