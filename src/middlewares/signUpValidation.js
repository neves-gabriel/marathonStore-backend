import signUpSchema from '../validations/signUp.js';

export default function signUpValidation(req, res, next) {
  const validation = signUpSchema.validate(req.body);

  if (validation.error) {
    return res
      .status(400)
      .send('Todos os campos devem ser devidamente preenchidos');
  }

  return next();
}
