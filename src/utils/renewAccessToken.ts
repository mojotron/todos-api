import { Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';

const renewAccessToken = (req: Request, res: Response): boolean => {
  let tokenRenewed = false;
  const refreshToken = req.cookies[process.env.REFRESH_TOKEN_NAME as string];
  if (!refreshToken) {
    // TODO trow error
    throw new Error('no refresh token provided');
  } else {
    verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
      // @ts-ignore
      (err, decoded) => {
        if (err) {
          // TODO throw error
          throw new Error('invalid refresh token');
        } else {
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
      },
    );
  }
  return tokenRenewed;
};

export default renewAccessToken;
