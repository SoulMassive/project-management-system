import { Router } from 'express';
import { 
  getClients, 
  createClient, 
  getClientById, 
  updateClient, 
  deleteClient, 
  getClientProjects, 
  addCommunication 
} from '../controllers/clients';
import { protect } from '../middleware/protect';
import { checkRole } from '../middleware/checkRole';

const router = Router();

router.use(protect);

router.get('/', checkRole('Admin', 'Manager', 'Sales'), getClients);
router.post('/', checkRole('Admin', 'Manager', 'Sales'), createClient);
router.get('/:id', checkRole('Admin', 'Manager', 'Sales'), getClientById);
router.patch('/:id', checkRole('Admin', 'Manager', 'Sales'), updateClient);
router.delete('/:id', checkRole('Admin', 'Manager'), deleteClient);
router.get('/:id/projects', checkRole('Admin', 'Manager', 'Sales'), getClientProjects);
router.post('/:id/communications', checkRole('Admin', 'Manager', 'Sales'), addCommunication);

export default router;
