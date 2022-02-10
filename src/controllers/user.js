import bcrypt from 'bcrypt';
import signUpSchema from '../validations/signUp';
import connection from '../database/connection.js';

async function userAlredyExists(email) {
  const existentUser = await connection.query(
    `SELECT * FROM users WHERE email = $1;`,
    [email]
  );
  if (existentUser.rowCount !== 0) return existentUser.rows;
  return false;
}

async function createUser(req, res) {
  try {
    const newUser = req.body;

    const validation = signUpSchema.validate(newUser);
    if (validation.error) {
      console.log(validation.error);
      res.sendStatus(400);
      return;
    }

    const { name, email, password } = newUser;

    if (await userAlredyExists(email)) {
      res.sendStatus(409);
      return;
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    await connection.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
      [name, email, passwordHash]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
}

export { createUser };
