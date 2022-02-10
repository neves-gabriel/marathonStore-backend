import { Router } from 'express';
import createUser from '../controllers/user.js';
import signUpValidation from '../middlewares/signUpValidation.js';
import connection from '../database/connection.js';

const routes = new Router();

routes.get('/health', async (req, res) => {
  res.sendStatus(200);
});

routes.post('/sign-up', signUpValidation, createUser);

routes.get('/test', async (req, res) => {
  try {
    await connection.mongoClient.connect();
    const collection = connection.db.collection('test');
    const response = await collection.find({}).toArray();
    res.send(response);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
  connection.mongoClient.close();
});

routes.post('/test', async (req, res) => {
  try {
    await connection.mongoClient.connect();
    const response = await connection.db
      .collection('test')
      .insertOne({ test: 'pai ta on!' });
    res.send(response);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
  connection.mongoClient.close();
});
export default routes;
