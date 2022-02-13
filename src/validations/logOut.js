import joi from 'joi';

const logOutSchema = joi.object({
  token: joi.string().email().required(),
});

export default logOutSchema;
