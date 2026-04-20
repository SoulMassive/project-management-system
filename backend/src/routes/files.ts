import { Router } from 'express';
import { 
  getProjectFiles, 
  uploadFile, 
  downloadFile, 
  deleteFile 
} from '../controllers/files';
import { 
  getProjectFolders, 
  createFolder, 
  updateFolder, 
  deleteFolder 
} from '../controllers/folders';
import { protect } from '../middleware/protect';
import { upload } from '../utils/upload';

const router = Router();

router.use(protect);

// Folder routes
router.get('/projects/:id/folders', getProjectFolders);
router.post('/projects/:id/folders', createFolder);
router.patch('/folders/:id', updateFolder);
router.delete('/folders/:id', deleteFolder);

// File routes
router.get('/projects/:id/files', getProjectFiles);
router.post('/projects/:id/files', upload.single('file'), uploadFile);
router.get('/files/:id/download', downloadFile);
router.delete('/files/:id', deleteFile);

export default router;
