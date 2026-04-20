import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser, getActivityLogs } from '../controllers/users';
import { protect } from '../middleware/protect';
import { checkRole } from '../middleware/checkRole';

const router = Router();

router.use(protect);
router.use(checkRole('Admin'));

router.get('/users', getUsers);
router.post('/users', createUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/activity-logs', getActivityLogs);

export default router;
