import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import renewAccessToken from '../utils/renewAccessToken';
import { throwCustomError } from 'src/utils/throwCustomError';
import { StatusCodes } from 'http-status-codes';
import { CustomErrorNames } from 'src/types/utilTypes';
//@ts-ignore
const validateUserViaCookie = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('hello');

  const accessToken = req.cookies[process.env.ACCESS_TOKEN_NAME as string];

  if (!accessToken) {
    if (renewAccessToken(req, res)) {
      return next();
    }
  } else {
    verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET as string,
      // @ts-ignore
      (err, decoded) => {
        if (err) {
          return res.status(403).json({ msg: 'invalid access token' });
        } else {
          // @ts-ignore
          req.user = { userId: decoded.userId };
          return next();
        }
      },
    );
  }
};

const validateUserViaBearer = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;
  try {
    if (authorization === undefined || !authorization.startsWith('Bearer ')) {
      throwCustomError(
        'Invalid Access Token',
        StatusCodes.UNAUTHORIZED,
        CustomErrorNames.unauthorized,
      );
    }

    const accessToken = authorization?.split(' ')[1];

    const decoded = verify(
      accessToken as string,
      process.env.ACCESS_TOKEN_NAME as string,
    ) as { userId: string };
    // @ts-ignore
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    return next(error);
  }
};

export { validateUserViaCookie, validateUserViaBearer };
