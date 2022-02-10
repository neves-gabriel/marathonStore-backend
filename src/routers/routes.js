import { Router } from 'express';
import createUser from '../controllers/user.js';
import signUpValidation from '../middlewares/signUpValidation.js';
import db from '../database/connection.js';

const routes = new Router();

routes.get('/health', async (req, res) => {
  res.sendStatus(200);
});

routes.post('/sign-up', signUpValidation, createUser);

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
