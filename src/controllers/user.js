import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import db from '../database/connection.js';

export async function createUser(req, res) {
  const newUser = req.body;
  try {
    const usersCollection = db.collection('users');
    if (await usersCollection.findOne({ email: newUser.email })) {
      res.status(409).send('Um usuário com esse e-mail já está cadastrado');
      return;
    }
    await db.collection('users').insertOne({
      ...newUser,
      password: bcrypt.hashSync(newUser.password, 10),
    });
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}

export async function logInUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      res.sendStatus(401).send('Esse e-mail não está cadastrado');
      return;
    }
    const isAuthorized = bcrypt.compareSync(password, user.password);
    if (isAuthorized) {
      const token = uuid();
      await db.collection('sessions').insertOne({ token, userId: user.id });
      res.sendStatus(201).send({ ...user, token });
    }
    res.sendStatus(401);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}