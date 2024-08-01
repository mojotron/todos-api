import { Router } from 'express';
import { getUser } from '../controllers/userController';
import validateUser from '../middlewares/validateUser';

const router = Router();

router.get('/profile', validateUser, getUser);

export default router;
