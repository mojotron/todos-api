import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatusOption, CustomErrorNames } from '../types/utilTypes';
import { CustomErrorType } from '../utils/throwCustomError';

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
  const errorObject = err as CustomErrorType;

  if (errorObject.errorName === CustomErrorNames.formValidation) {
    return res.status(errorObject.statusCode).json({
      status: ResponseStatusOption.error,
      message: errorObject.message,
      errorName: errorObject.errorName,
      inputFieldsErrors: errorObject.inputFields,
    });
  }

  if (errorObject.errorName === CustomErrorNames.badRequest) {
    return res.status(errorObject.statusCode).json({
      status: ResponseStatusOption.error,
      message: errorObject.message,
      errorName: errorObject.errorName,
    });
  }

  if (errorObject.errorName === CustomErrorNames.unauthorized) {
    return res.status(errorObject.statusCode).json({
      status: ResponseStatusOption.error,
      message: errorObject.message,
      errorName: errorObject.errorName,
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: ResponseStatusOption.error,
    message: 'Internal Server Error',
    //errors: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};

export { notFound, errorHandler };
