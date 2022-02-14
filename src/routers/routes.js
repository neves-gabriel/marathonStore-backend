import { Router } from 'express';
import { createUser, logInUser } from '../controllers/user.js';
import { postOrder } from '../controllers/products.js';
import signUpValidation from '../middlewares/signUpValidation.js';
import logInValidation from '../middlewares/logInValidation.js';
import db from '../database/connection.js';

const routes = new Router();

routes.get('/health', async (req, res) => {
  res.sendStatus(200);
});

routes.post('/sign-up', signUpValidation, createUser);

routes.post('/login', logInValidation, logInUser);

routes.delete('/logout', async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');
  if (!token) {
    res.sendStatus(401);
  }
  const session = await db.collection('sessions').findOne({ token });
  if (!session) {
    res.sendStatus(401);
  }
  const user = await db.collection('users').findOne({ _id: session.userId });
  if (!user) {
    res.sendStatus(401);
  }
  try {
    await db.collection('sessions').deleteOne({ userId: session.userId });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

routes.post('/order', postOrder);

routes.get('/products', async (req, res) => {
  try {
    const collection = db.collection('products');
    const response = await collection.find({}).toArray();
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

routes.get('/products/:selectedCategory', async (req, res) => {
  const { selectedCategory } = req.params;
  try {
    const collection = db.collection('products');
    const response = await collection
      .find({ category: selectedCategory })
      .toArray();
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

routes.get('/releases', async (req, res) => {
  try {
    const collection = db.collection('releases');
    const response = await collection
      .find({})
      .toArray();
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

routes.get('/test', async (req, res) => {
  try {
    const collection = db.collection('test');
    const response = await collection.find({}).toArray();
    res.send(response);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

routes.post('/test', async (req, res) => {
  try {
    const response = await db
      .collection('test')
      .insertOne({ test: 'pai ta on!' });
    res.send(response);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
export default routes;
