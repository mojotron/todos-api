import { Router } from 'express';
import {
  createProject,
  getProjects,
  deleteProject,
  editProject,
} from '../controllers/projectController';

const router = Router();

router.post('/', createProject);
router.get('/', getProjects);
router.delete('/:projectId', deleteProject);
router.patch('/:projectId', editProject);

export default router;
