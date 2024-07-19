import { Request, Response, NextFunction } from 'express';
import { signupValidator } from '../config/inputValidators';
import { ResponseStatusOption } from '../types/utilTypes';
import { StatusCodes } from 'http-status-codes';

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;
    const { error } = signupValidator({ username, email, password });

    if (error) {
      // TODO create custom error for frontend
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: ResponseStatusOption.error,
        message: error.details.map((item) => item.message),
      });
    }

    return res
      .status(200)
      .json({ status: ResponseStatusOption.success, message: 'OK' });
  } catch (error) {
    return next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;

    return res.status(200).json({
      status: ResponseStatusOption.success,
      message: 'OK',
      username,
      email,
      password,
    });
  } catch (error) {
    return next(error);
  }
};

export { signup, login };
