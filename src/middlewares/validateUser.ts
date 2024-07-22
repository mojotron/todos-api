import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import renewAccessToken from '../utils/renewAccessToken';
//@ts-ignore
const validateUser = (req: Request, res: Response, next: NextFunction) => {
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

export default validateUser;
