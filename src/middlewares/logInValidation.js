import logInSchema from '../validations/logIn.js';

export default function logInValidation(req, res, next) {
  const validation = logInSchema.validate(req.body);

  if (validation.error) {
    return res
      .status(400)
      .send('Todos os campos devem ser devidamente preenchidos');
  }

  return next();
}
