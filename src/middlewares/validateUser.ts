import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, verify } from 'jsonwebtoken';
import renewAccessToken from '../utils/renewAccessToken';
import { throwCustomError } from 'src/utils/throwCustomError';
import { StatusCodes } from 'http-status-codes';
import { CustomErrorNames } from 'src/types/utilTypes';

//@ts-ignore
const validateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies[process.env.ACCESS_TOKEN_NAME as string];
    if (!accessToken) {
      console.log('here');

      if (renewAccessToken(req, res)) {
        console.log('here 2');
        return next();
      }
      return res.status(401).json({ message: 'invalid refres token' });
    }
    const decoded = verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET as string,
    ) as { userId: string };
    // @ts-ignore
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return res.status(403).json({ msg: 'invalid access token' });
    }
  }
};

export default validateUser;
