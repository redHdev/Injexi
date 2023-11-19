import { connectDatabase, getDb } from '/utilities/mongodb';

export default async (req, res) => {
  try {
    // Connect to your database
    await connectDatabase();

    // Get the database instance
    const db = await getDb();

    // Get the collection where your businesses are stored
    const collection = db.collection('BusinessMasterlistCollection');

    // Extract the Injexi Profile Link from the request query
    const { profileLink } = req.query;

    if (profileLink) {
      // Query the database to find the business with the matching Injexi Profile Link nested under businessDetails
      const business = await collection.findOne({ 'businessDetails.Injexi Profile Link': profileLink });

      if (business) {
        // If a business with the given Injexi Profile Link is found, return it in the response
        res.status(200).json({ success: true, data: business });
      } else {
        // If no business is found, return a 404 status with an appropriate message
        res.status(404).json({ success: false, message: 'Business not found' });
      }
    } else {
      // If no Injexi Profile Link is provided, return a 400 status with an appropriate message
      res.status(400).json({ success: false, message: 'Injexi Profile Link is required' });
    }
  } catch (error) {
    // If an error occurs, return a 500 status with the error message
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};
