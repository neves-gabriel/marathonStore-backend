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
    newUser.hashedPassword = bcrypt.hashSync(newUser.password, 10);
    delete newUser.password;
    await usersCollection.insertOne(newUser);
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send('Houve uma falha ao cadastrar usuário. Por favor, tente novamente');
  }
}
