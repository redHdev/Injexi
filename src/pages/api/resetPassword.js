// Import required packages and modules
import bcrypt from "bcryptjs";
import { connectDatabase, getDb } from "../../../utilities/mongodb";
import sgMail from '@sendgrid/mail';

// Setting the SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send confirmation email
const sendConfirmationEmail = async (email) => {
  const msg = {
    to: email,
    from: {
      email: 'cs@injexi.com',
      name: 'Injexi'
    },
    subject: 'Password Changed Successfully',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h1 style="background-color: #252525; color: white; padding: 20px; text-align: center;">
        Password Changed Successfully
      </h1>
      <div style="padding: 20px; text-align: center;">
        <h2>Your Password Has Been Changed</h2>
        <p style="margin-bottom: 30px;">This is a confirmation that your password has been changed successfully.</p>
        <p style="margin-bottom: 30px;">If you didn't request this change, please reply to this email.</p>
      </div>
    </div>`,
  };

  try {
    await sgMail.send(msg);
    return { success: true, message: 'Confirmation email sent successfully.' };
  } catch (error) {
    return { success: false, message: `Error sending confirmation email: ${error.message}` };
  }
};

// Main function for API route
export default async (req, res) => {
  try {
    await connectDatabase();
    const db = await getDb();
    const usersCollection = db.collection("Users");
    const tokensCollection = db.collection("ResetTokens");
  
    // Find user's email using token
    const tokenRecord = await tokensCollection.findOne({ token: req.body.token });
  
    if (!tokenRecord || tokenRecord.used) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.',
      });
    }
  
    // Get user's details using email from token record
    const user = await usersCollection.findOne({ email: tokenRecord.email });
  
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }
  
    // Hash new password and update it in the Users collection
    const newPasswordHash = await bcrypt.hashSync(req.body.newPassword);
    const currentDateTime = new Date();
  
    const result = await usersCollection.updateOne(
      { email: tokenRecord.email },
      {
        $set: { 
          password: newPasswordHash,
          updatedAt: currentDateTime
        }
      }
    );
  
    if (result.modifiedCount === 1) {
      // Mark the token as used without deleting the document
      await tokensCollection.updateOne(
        { token: req.body.token },
        {
          $set: { 
            used: true,
            usedAt: currentDateTime
          }
        }
      );
  
      // Send confirmation email
      const emailResult = await sendConfirmationEmail(tokenRecord.email);
      if (!emailResult.success) {
        console.log(`Failed to send confirmation email: ${emailResult.message}`);
      }
  
      return res.status(200).json({
        success: true,
        message: 'Password updated successfully.',
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Password update failed.',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
