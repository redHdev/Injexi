import { connectDatabase, getDb } from '/utilities/mongodb';

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      await connectDatabase();

      const db = await getDb();
      const collection = db.collection('BusinessReviews');

      // Get the internal ID from the query parameters
      const { internalId } = req.query;

      if (!internalId) {
        return res.status(400).json({ success: false, message: 'Internal ID is required in the query parameters.' });
      }

      // Use the internal ID to filter reviews
      const data = await collection.find({ internalId: Number(internalId) }).toArray();

      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed', message: 'Only GET requests are supported.' });
  }
};
