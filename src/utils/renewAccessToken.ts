import { Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { throwCustomError } from './throwCustomError';
import { StatusCodes } from 'http-status-codes';
import { CustomErrorNames } from '../types/utilTypes';

const renewAccessToken = (req: Request, res: Response): boolean => {
  try {
    let tokenRenewed = false; // flag variable
    const refreshToken = req.cookies[process.env.REFRESH_TOKEN_NAME as string];
    if (!refreshToken) {
      throwCustomError(
        'no refresh token provided',
        StatusCodes.UNAUTHORIZED,
        CustomErrorNames.unauthorized,
      );
    } else {
      const decoded = verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      ) as { userId: string };

      const accessToken = sign(
        { userId: decoded.userId },
        process.env.JWT_ACCESS_SECRET as string,
        { expiresIn: '10min' },
      );
      res.cookie(process.env.ACCESS_TOKEN_NAME as string, accessToken, {
        maxAge: 1000 * 60 * 10,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'development' ? false : true,
      });
      // @ts-ignore
      req.user = { userId: decoded.userId };
      tokenRenewed = true;
    }
    return tokenRenewed;
  } catch (error) {
    return false;
  }
};

export default renewAccessToken;
