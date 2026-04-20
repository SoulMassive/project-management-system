import { Router } from 'express';
import { 
  getProjectTasks, 
  createTask, 
  getTaskById, 
  updateTask, 
  deleteTask, 
  updateTaskStatus, 
  addSubtask, 
  toggleSubtask, 
  addComment 
} from '../controllers/tasks';
import { protect } from '../middleware/protect';

const router = Router();

router.use(protect);

// Project-specific task routes
router.get('/projects/:id/tasks', getProjectTasks);
router.post('/projects/:id/tasks', createTask);

// Task-specific routes
router.get('/tasks/:id', getTaskById);
router.patch('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);
router.patch('/tasks/:id/status', updateTaskStatus);
router.post('/tasks/:id/subtasks', addSubtask);
router.patch('/tasks/:id/subtasks/:sid', toggleSubtask);
router.post('/tasks/:id/comments', addComment);

export default router;
