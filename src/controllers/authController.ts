import { Request, Response, NextFunction } from 'express';
import { loginValidator, signupValidator } from '../config/inputValidators';
import { CustomErrorNames, ResponseStatusOption } from '../types/utilTypes';
import { StatusCodes } from 'http-status-codes';
import User from '../models/userSchema';
import {
  throwInputFieldsError,
  throwCustomError,
} from '../utils/throwCustomError';
import { JsonWebTokenError, sign, verify } from 'jsonwebtoken';

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    // validate user input
    const { error } = signupValidator({
      username,
      email,
      password,
      confirmPassword,
    });
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
    const { email, password } = req.body;

    const { error } = loginValidator({ email, password });
    if (error) {
      throwInputFieldsError(error.details.map((item) => item.message));
    }

    const user = await User.findOne({ email }).exec();

    if (user === null || (await user.validatePassword(password)) === false) {
      throwCustomError(
        'Invalid Email or Password',
        StatusCodes.BAD_REQUEST,
        CustomErrorNames.badRequest,
      );
    }

    // create tokens
    const accessToken = sign(
      { userId: user?._id },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: '10min' },
    );

    const refreshToken = sign(
      { userId: user?._id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: '7d' },
    );
    // CREATE HTTP only cookie for  refresh token
    res.cookie(process.env.REFRESH_TOKEN_NAME as string, refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'development' ? false : true,
    });

    return res.status(200).json({
      status: ResponseStatusOption.success,
      message: 'User Logged In Successfully',
      accessToken,
    });
  } catch (error) {
    return next(error);
  }
};

const refreshToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies[process.env.REFRESH_TOKEN_NAME as string];
    const decoded = verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
    ) as { userId: string };

    const accessToken = sign(
      { userId: decoded.userId },
      process.env.JWT_ACCESS_SECRET as string,
      {
        expiresIn: '10m',
      },
    );
    return res.status(201).json({
      status: ResponseStatusOption.success,
      message: 'User Refreshed Token Successfully',
      accessToken,
    });
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return next(new Error('invalid token'));
    }
    return next(error);
  }
};

const logout = (req: Request, res: Response, next: NextFunction) => {
  res.cookie(process.env.REFRESH_TOKEN_NAME as string, '', {
    maxAge: 0,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'development' ? false : true,
  });

  res.status(200).json({
    status: ResponseStatusOption.success,
    message: 'User Logged out Successfully',
  });
};

export { signup, login, refreshToken, logout };
