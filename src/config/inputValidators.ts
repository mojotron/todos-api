import Joi from 'joi';
import passwordComplexity from 'joi-password-complexity';

export const signupValidator = (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const schema = Joi.object({
    username: Joi.string()
      .required()
      .min(3)
      .max(30)
      .pattern(/[a-zA-Z0-9_-]/)
      .label('username'),
    email: Joi.string().email().required().label('email'),
    password: passwordComplexity().required().label('password'),
  });

  return schema.validate(data, { abortEarly: false });
};

export const loginValidator = (data: { email: string; password: string }) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label('email'),
    password: Joi.string().required().label('password'),
  });

  return schema.validate(data);
};
