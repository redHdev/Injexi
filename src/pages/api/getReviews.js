import { connectDatabase, getDb } from '/utilities/mongodb';

export default async (req, res) => {
  try {
    await connectDatabase();

    const db = await getDb();
    const collection = db.collection('BusinessReviews');

    const data = await collection.find({}).toArray(); // This fetches all documents. Adjust query as necessary.
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};