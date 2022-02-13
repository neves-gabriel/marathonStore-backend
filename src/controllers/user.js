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
      res.status(401).send('Esse e-mail não está cadastrado');
    } else {
      const isAuthorized = bcrypt.compareSync(password, user.password);
      if (isAuthorized) {
        const receivedToken = await db
          .collection('sessions')
          .findOne({ userId: user._id });
        const token = receivedToken ? receivedToken.token : uuid();
        if (!receivedToken) {
          await db
            .collection('sessions')
            .insertOne({ token, userId: user._id });
        }
        res
          .status(200)
          .send({ userId: user._id, name: user.name, email, token });
      } else {
        res.status(401).send('Senha incorreta');
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}

export async function logOutUser(req, res) {
  const { userId } = req.headers;
  try {
    await db.collection('sessions').deleteOne({ userId });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}
