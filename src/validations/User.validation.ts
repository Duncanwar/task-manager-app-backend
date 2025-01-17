import Joi from "joi";

export const signupSchema = Joi.object().keys({
  name: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().required().email(),
  role: Joi.string().required(),
});

export const loginSchema = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

export const changePasswordSchema = Joi.object().keys({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required().min(6),
});
