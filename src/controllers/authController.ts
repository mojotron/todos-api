import { Request, Response, NextFunction } from 'express';
import { signupValidator } from '../config/inputValidators';
import { CustomErrorNames, ResponseStatusOption } from '../types/utilTypes';
import { StatusCodes } from 'http-status-codes';
import User from '../models/userSchema';
import {
  throwInputFieldsError,
  throwCustomError,
} from '../utils/throwCustomError';

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;
    // validate user input
    const { error } = signupValidator({ username, email, password });
    if (error) throwInputFieldsError(error.details.map((item) => item.message));
    // check if username and email are available
    const usernameExists = await User.findOne({ username }).lean().exec();
    if (usernameExists) throwInputFieldsError(['"username" already exists']);
    const emailExists = await User.findOne({ email }).lean().exec();
    if (emailExists) throwInputFieldsError(['"email" already exists']);
    // create new user after validation and db lookup
    const newUser = await User.create({ username, email, password });
    if (newUser) {
      return res.status(200).json({
        status: ResponseStatusOption.success,
        message: 'new user created successfully',
      });
    } else {
      throwCustomError(
        'could not create new user, please try again later',
        StatusCodes.BAD_REQUEST,
        CustomErrorNames.badRequest,
      );
    }
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
