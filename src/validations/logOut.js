import joi from 'joi';

const logOutSchema = joi.object({
  token: joi.string().required(),
});

export default logOutSchema;
