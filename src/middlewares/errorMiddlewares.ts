import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatusOption } from '../types/utilTypes';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    status: ResponseStatusOption.error,
    message: 'Resources Not Found',
  });
};

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: ResponseStatusOption.error,
    message: 'Internal Server Error',
    errors: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};

export { notFound, errorHandler };
