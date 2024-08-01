import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import User from '../models/userSchema';
import { CustomErrorNames, ResponseStatusOption } from '../types/utilTypes';
import { throwCustomError } from '../utils/throwCustomError';

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const { userId } = req.user;
    const user = await User.findOne({ _id: userId }).select('username');
    if (user) {
      return res.status(StatusCodes.OK).json({
        status: ResponseStatusOption.success,
        message: 'user profile',
        user: { username: user.username },
      });
    } else {
      throwCustomError(
        'User not found',
        StatusCodes.BAD_REQUEST,
        CustomErrorNames.badRequest,
      );
    }
  } catch (error) {
    return next(error);
  }
};

export { getUser };
