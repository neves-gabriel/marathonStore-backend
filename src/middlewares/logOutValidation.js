import logOutSchema from '../validations/logOut.js';

export default function logOutValidation(req, res, next) {
  const validation = logOutSchema.validate(req.headers);

  if (validation.error) {
    return res
      .status(400)
      .send('Todos os campos devem ser devidamente preenchidos');
  }

  return next();
}
