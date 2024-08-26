import { Router } from 'express';
import {
  createTask,
  getTasks,
  deleteTask,
  editTask,
} from '../controllers/taskController';

const router = Router();

router.post('/', createTask);
router.get('/', getTasks);
router.delete('/:taskId', deleteTask);
router.patch('/:taskId', editTask);

export default router;
