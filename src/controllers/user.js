import bcrypt from 'bcrypt';
import connection from '../database/connection.js';

export default async function createUser(req, res) {
  const newUser = req.body;

  try {
    const participant = await connection
      .collection('users')
      .findOne({ email: newUser.email });
    if (participant) return res.status(409).send('Participante já cadastrado');

    await connection.collection('users').insertOne({
      ...newUser,
      password: bcrypt.hashSync(newUser.password, 10),
    });
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
  }
}
