import { connectDatabase, getDb } from "../../../utilities/mongodb";
import crypto from 'crypto'; // Importing the crypto library for generating tokens
import { sendResetEmail } from './sendResetEmail'; // Assuming you have a function to send the reset email

export default async (req, res) => {
  console.log('Entered generateResetToken API'); 
  try {
    console.log('Request received for password reset'); // Added for debugging
    
    await connectDatabase();
    const db = await getDb();
    const usersCollection = db.collection("Users");
    const resetTokensCollection = db.collection("ResetTokens");

    // Convert the email to lowercase
    const emailLowercase = req.body.email.toLowerCase();
    console.log(`Checking for existing user with email: ${emailLowercase}`); // Added for debugging
    
    const existingUser = await usersCollection.findOne({ email: emailLowercase });

    if (!existingUser) {
      console.log('User not found'); // Added for debugging
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString('hex');
    console.log('Generated token:', token); // Added for debugging
    
    // Get the current date and time
    const currentDateTime = new Date();

    // Token expiration time, e.g., 1 hour from now
    const tokenExpiration = new Date(currentDateTime);
    tokenExpiration.setHours(tokenExpiration.getHours() + 1);

    // Insert the token, email, and expiration time into the "ResetTokens" collection
    await resetTokensCollection.insertOne({
      email: emailLowercase,
      token,
      createdAt: currentDateTime,
      expiresAt: tokenExpiration
    });
    console.log('Token inserted into database'); // Added for debugging
    
    // Send the reset token via email
    const emailResult = await sendResetEmail(emailLowercase, token);
    
    console.log('Email sending result:', emailResult);  // Added for debugging
    
    if (emailResult.success) {
      // Successfully sent the email
      res.status(200).json({
        success: true,
        message: 'Password reset token generated and email sent successfully',
      });
    } else {
      // Handle email sending failure
      console.log('Email sending failed:', emailResult.message);  // Added for debugging
      res.status(500).json({
        success: false,
        message: `Failed to send reset email: ${emailResult.message}`
      });
    }
  } catch (error) {
    console.log('Caught error:', error.message);  // Added for debugging
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};
