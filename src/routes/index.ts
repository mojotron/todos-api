import { Router } from 'express';
import authRoutes from './authRoutes';
import validateUser from '../middlewares/validateUser';

const router = Router();

// TEMP
router.get('/api/v1/test', validateUser, (req, res) => {
  // @ts-ignore
  const { userId } = req.user;
  return res.status(200).json({ msg: `this is user ${userId}` });
});

router.use('/api/v1/auth', authRoutes);

export default router;
