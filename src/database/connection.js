import '../setup.js';
import { MongoClient } from 'mongodb';

const mongoClient = new MongoClient(process.env.MONGO_URI);
const db = mongoClient.db(process.env.DB_NAME);

const connection = { mongoClient, db };

export default connection;
