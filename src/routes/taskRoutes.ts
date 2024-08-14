import { Router } from 'express';
import { createTask } from '../controllers/taskController';

const router = Router();

router.post('/', createTask);

export default router;
