import { celebrate, Joi } from "celebrate";

const signinValidator = celebrate(
  {
    body: Joi.object().keys({
      username: Joi.string().trim().required(),
      password: Joi.string().required(),
    }),
  },
  {
    abortEarly: false,
  },
  { mode: "full" }
);

export default signinValidator;
