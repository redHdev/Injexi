import { connectDatabase, getDb } from "../../../utilities/mongodb";

export default async (req, res) => {
  try {
    await connectDatabase();

    const db = await getDb();
    const collection = db.collection("ResetTokens");

    // Get the token from the query parameter
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'No token provided.',
      });
    }

    // Find the token in the ResetTokens collection
    const resetTokenEntry = await collection.findOne({ token: token });

    if (!resetTokenEntry) {
      return res.status(404).json({
        success: false,
        message: 'Token is invalid or has expired.',
      });
    }

    // Check if the token has been used
    if (resetTokenEntry.used) {
      return res.status(400).json({
        success: false,
        message: 'Token has already been used.',
        used: true // explicitly mark the token as used
      });
    }

    // Optionally, you can check for token expiry here

    res.status(200).json({
      success: true,
      message: 'Token is valid and unused.', // Changed the message to reflect unused status
      used: false, // explicitly mark the token as unused
      email: resetTokenEntry.email // you can also return the email associated with the token if needed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};
