import { connectDatabase, getDb } from "../../../utilities/mongodb";
import crypto from 'crypto'; // Importing the crypto library for generating tokens
import { sendVerificationEmail } from './sendEmailVerify';

export default async (req, res) => {
  try {
    connectDatabase();

    const db = await getDb();
    const collection = db.collection("Users");

    // Convert the email to lowercase
    const emailLowercase = req.body.email.toLowerCase();

    const existingUser = await collection.findOne({ email: emailLowercase });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists.',
      });
    }

    // Generate a verification token
    const token = crypto.randomBytes(32).toString('hex');

    // Get the current date and time
    const currentDateTime = new Date();

    // Include the current date and time as 'createdAt', 'updatedAt', and the token
    const dataToInsert = { 
      ...req.body, 
      email: emailLowercase, 
      createdAt: currentDateTime,
      updatedAt: currentDateTime,
      isVerified: false,
      verificationToken: token // add the verification token to the user's record
    };

    const result = await collection.insertOne(dataToInsert);

    // Send a verification email
    const emailResult = await sendVerificationEmail(emailLowercase, token);

    if (emailResult.success) {
      // Successfully sent the email
      res.status(200).json({
        success: true,
        message: 'User registered and verification email sent successfully',
        data: result
      });
    } else {
      // Handle email sending failure
      res.status(500).json({
        success: false,
        message: `Failed to send verification email: ${emailResult.message}`
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};
