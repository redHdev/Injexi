import { connectDatabase, getDb } from '/utilities/mongodb';

export default async (req, res) => {
  try {
    await connectDatabase();

    const db = await getDb();
    const collection = db.collection('ServiceCategories');

    const { serviceName } = req.query; // Destructuring the serviceName from the query parameters

    let data;
    if (serviceName) {
      // Fetch a single document by serviceName
      data = await collection.findOne({ serviceName: serviceName });
      if (!data) {
        return res.status(404).json({ success: false, message: 'Service category not found' });
      }
    } else {
      // Fetch all documents
      data = await collection.find({}).toArray();
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};
