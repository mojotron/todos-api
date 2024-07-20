import { StatusCodes } from 'http-status-codes';
import { CustomErrorNames } from '../types/utilTypes';

type InputFieldsMessageErrors = { [key: string]: string };

export type CustomErrorType = Error & {
  statusCode: number;
  errorName: CustomErrorNames;
  inputFields?: InputFieldsMessageErrors | null;
};

type CustomInputFieldsErrorType = CustomErrorType & {
  inputsError: InputFieldsMessageErrors;
};

export const throwCustomError = (
  message: string,
  statusCode: number,
  errorName: CustomErrorNames,
) => {
  const customError = new Error(message) as CustomErrorType;
  customError.statusCode = statusCode;
  customError.errorName = errorName;

  throw customError;
};

export const throwInputFieldsError = (inputFields: string[]) => {
  const customError = new Error(
    'Wrong Input Data Format',
  ) as CustomInputFieldsErrorType;

  customError.errorName = CustomErrorNames.formValidation;
  customError.statusCode = StatusCodes.BAD_REQUEST;

  const inputErrorObject: InputFieldsMessageErrors = {};
  // Joi return error message in form '"label" error message'
  inputFields.forEach((item) => {
    const parts = item.split(' ');
    const label = parts[0].replace(/"/g, '');
    inputErrorObject[label] = `${label} ${parts.slice(1).join(' ')}`;
  });

  customError.inputFields = inputErrorObject;

  console.log(inputErrorObject);

  throw customError;
};
