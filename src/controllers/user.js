import bcrypt from 'bcrypt';
import connection from '../database/connection.js';

export default async function createUser(req, res) {
  const newUser = req.body;
  try {
    const usersCollection = connection.collection('users');
    if (await usersCollection.findOne({ email: newUser.email })) {
      res.status(409).send('Um usuário com esse e-mail já está cadastrado');
      return;
    }
    await connection.collection('users').insertOne({
      ...newUser,
      password: bcrypt.hashSync(newUser.password, 10),
    });
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}
