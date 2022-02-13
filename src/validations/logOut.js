import joi from 'joi';

const logOutSchema = joi.object({
  userId: joi.string().required(),
});

export default logOutSchema;
