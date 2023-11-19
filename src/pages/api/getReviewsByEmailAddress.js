import { connectDatabase, getDb } from '/utilities/mongodb';

export default async (req, res) => {
  // Check if the HTTP method is GET
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Only GET requests are supported.'
    });
  }

  try {
    // Connect to MongoDB and get the database object
    await connectDatabase();
    const db = await getDb();
    const collection = db.collection('BusinessReviews');

    // Get the customer email from the query parameters
    const customerEmail = req.query.email;

    // Check if the customer email is provided
    if (!customerEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email is required in the query parameters.'
      });
    }

    // Query MongoDB to find reviews based on customerEmail, exclude the customerPhone field
    const data = await collection.find({ customerEmail }, { projection: { customerPhone: 0, customerEmail: 0 } }).toArray();


    // Send the data back in the response
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    // Log the error and send a 500 Internal Server Error response
    console.error('Error occurred:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};
