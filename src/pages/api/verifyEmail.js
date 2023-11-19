import { connectDatabase, getDb } from "../../../utilities/mongodb";

export default async (req, res) => {
  try {
    await connectDatabase();

    const db = await getDb();
    const collection = db.collection("Users");

    // Get the token from the query parameter
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'No token provided.',
      });
    }

    // Find the user with the provided token
    const user = await collection.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Token is invalid or has expired.',
      });
    }

    // Update the user's isVerified field to true, 
    // remove the verification token and set isEmailPendingVerification to false
    await collection.updateOne(
      { verificationToken: token },
      {
        $set: { isVerified: true },
        $unset: { verificationToken: "", isEmailPendingVerification: "" }
      }
    );
    

    res.status(200).json({
      success: true,
      message: 'Email verification successful.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};
