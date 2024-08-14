import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatusOption } from '../types/utilTypes';

const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res
      .status(StatusCodes.CREATED)
      .json({ status: ResponseStatusOption.success, message: 'task created' });
  } catch (error) {
    return next(error);
  }
};

export { createTask };
