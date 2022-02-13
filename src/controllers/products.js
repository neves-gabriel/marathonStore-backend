import db from '../database/connection.js';

export async function getProducts(res) {
  try {
    const collection = db.collection('products');
    const response = await collection.find({}).toArray();
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}
