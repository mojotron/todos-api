import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import projectRoutes from './projectRoutes';
import taskRoutes from './taskRoutes';
import validateUser from '../middlewares/validateUser';

const router = Router();

router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/user', userRoutes);
router.use('/api/v1/projects', validateUser, projectRoutes);
router.use('/api/v1/tasks', validateUser, taskRoutes);

export default router;
