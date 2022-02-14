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

export async function postOrder(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');
  const { products, value, payment } = req.body;
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
    await db.collection('orders').insertOne({
      userId: user._id,
      name: user.name,
      email: user.email,
      products,
      value,
      payment,
    });
    res.status(201).send('Pedido feito com sucesso!');
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}
