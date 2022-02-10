import '../setup.js';
import { MongoClient } from 'mongodb';

const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient.connect();
const db = mongoClient.db(process.env.DB_NAME);

export default db;
