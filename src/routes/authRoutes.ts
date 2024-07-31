import { Router } from 'express';
import { signup, login, logout } from '../controllers/authController';
import validateUser from '../middlewares/validateUser';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.delete('/logout', logout);

router.get('/test', validateUser, (req, res) => {
  // @ts-ignore
  const { userId } = req.user;
  return res.status(200).json({ message: 'test successful', userId });
});

export default router;
