import { Router } from 'express';
import { 
  getProjects, 
  createProject, 
  getProjectById, 
  updateProject, 
  deleteProject, 
  updateProjectStage, 
  manageTeam, 
  addNote 
} from '../controllers/projects';
import { protect } from '../middleware/protect';
import { checkRole } from '../middleware/checkRole';

const router = Router();

router.use(protect);

router.get('/', getProjects);
router.post('/', checkRole('Admin', 'Manager'), createProject);
router.get('/:id', getProjectById);
router.patch('/:id', checkRole('Admin', 'Manager'), updateProject);
router.delete('/:id', checkRole('Admin', 'Manager'), deleteProject);
router.patch('/:id/stage', checkRole('Admin', 'Manager'), updateProjectStage);
router.post('/:id/team', checkRole('Admin', 'Manager'), manageTeam);
router.post('/:id/notes', addNote);

export default router;
