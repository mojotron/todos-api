type CustomErrorType = Error & { statusCode: number; errorName: string };

const throwCustomError = (
  message: string,
  statusCode: number,
  errorName: string,
) => {
  const customError = new Error(message) as CustomErrorType;
  customError.statusCode = statusCode;
  customError.errorName = errorName;

  throw customError;
};

export default throwCustomError;
