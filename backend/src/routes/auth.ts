import { Router } from 'express';
import { login, register, logout, refresh, me } from '../controllers/auth';
import { protect } from '../middleware/protect';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', protect, me);

export default router;
