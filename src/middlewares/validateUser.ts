import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, verify } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import renewAccessToken from '../utils/renewAccessToken';
import { CustomErrorType, throwCustomError } from '../utils/throwCustomError';
import { CustomErrorNames } from '../types/utilTypes';

const validateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies[process.env.ACCESS_TOKEN_NAME as string];

    if (!accessToken) {
      if (renewAccessToken(req, res)) {
        console.log('renew token');
        return next();
      } else {
        throwCustomError(
          'invalid refresh token',
          StatusCodes.UNAUTHORIZED,
          CustomErrorNames.unauthorized,
        );
      }
    }
    const decoded = verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET as string,
    ) as { userId: string };
    // @ts-ignore
    req.user = { userId: decoded.userId };
    return next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      const err = new Error('invalid access token') as CustomErrorType;
      err.errorName = CustomErrorNames.unauthorized;
      err.statusCode = StatusCodes.UNAUTHORIZED;
      return next(err);
    }
    return next(error);
  }
};

export default validateUser;
