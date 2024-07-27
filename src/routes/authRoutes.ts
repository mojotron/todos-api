import { Router } from 'express';
import {
  signup,
  login,
  refreshToken,
  logout,
} from '../controllers/authController';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refreshToken', refreshToken);
router.delete('/logout', logout);

export default router;
