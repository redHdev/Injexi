import sgMail from '@sendgrid/mail';
import bcrypt from 'bcryptjs';
import { connectDatabase, getDb } from "../../../utilities/mongodb";
import crypto from 'crypto';
import { sendVerificationEmail } from './sendEmailVerify';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async (req, res) => {
  try {
    // Initialize MongoDB connection
    await connectDatabase();
    const db = await getDb();
    const usersCollection = db.collection("Users");
    const reviewsCollection = db.collection("BusinessReviews");

    const { email, firstName, password, phoneNumber, reviewTitle, review, rating, currentURL, referringURL, businessName, internalId, businessEmail, injexiProfileLink } = req.body;
    
    const emailLowercase = email.toLowerCase();
    const currentDateTime = new Date();
    const token = crypto.randomBytes(32).toString('hex');

    // Check if user already exists
    let existingUser = await usersCollection.findOne({ email: emailLowercase });
    let userId;  // Initialize a variable to hold the user ID

    if (!existingUser) {
      // Hash the password and insert into Users collection if user doesn't exist
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const userDataToInsert = {
        email: emailLowercase,
        firstName,
        password: hashedPassword,
        profilePhoto: "",
        lastName: "",
        phoneNumber,
        newsletterSubscribed: true,
        suburb: "",
        postcode: 0,
        country: "",
        createdAt: currentDateTime,
        updatedAt: currentDateTime,
        isVerified: false,
        isPhoneVerified: true,
        verificationToken: token,
        profileCompletion: 35
      };

      const userInsertResult = await usersCollection.insertOne(userDataToInsert);
      userId = userInsertResult.insertedId; // Store the new user ID
    } else {
      userId = existingUser._id; // Store the existing user ID

      // Check if phone number is missing in the existing user profile
      if (!existingUser.phoneNumber && phoneNumber) {
        // Update the phone number in the Users collection
        await usersCollection.updateOne({ _id: existingUser._id }, {
          $set: { 
            phoneNumber,
            isPhoneVerified: true
           }
        });
      }
    }

    // Prepare review data and insert into BusinessReviews collection
    const reviewDataToInsert = {
      userId, // Use the user ID here
      internalId,
      businessName,
      customerName: firstName,
      customerEmail: emailLowercase,
      customerPhone: phoneNumber,
      starRating: rating,
      review,
      reviewReply: "",
      verified: true,
      createdAt: currentDateTime,
      updatedAt: currentDateTime,
      approved: false
    };

    await reviewsCollection.insertOne(reviewDataToInsert);

    // Send notification email
    await sendToCS(firstName, email, reviewTitle, review, rating, phoneNumber, currentURL, referringURL, businessName, internalId, businessEmail, injexiProfileLink);

    // Send verification email only for new users
    if (!existingUser) {
      const emailResult = await sendVerificationEmail(emailLowercase, token);
      if (emailResult.success) {
        return res.status(200).json({
          success: true,
          message: 'User registered and verification email sent successfully',
        });
      } else {
        return res.status(500).json({
          success: false,
          message: `Failed to send verification email: ${emailResult.message}`
        });
      }
    } else {
      // For existing users
      return res.status(200).json({
        success: true,
        message: 'Review submitted successfully',
      });
    }
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

async function sendToCS(firstName, email, reviewTitle, review, rating, phoneNumber, currentURL, referringURL, businessName, internalId, businessEmail, injexiProfileLink) {
  try {
    const msg = {
      to: 'cs@injexi.com',
      from: 'cs@injexi.com',
      subject: `New Review For ${businessName}`,
      html: `
        <strong>Name:</strong> ${firstName} <br>
        <strong>Email:</strong> ${email} <br>
        <strong>Review Title:</strong> ${reviewTitle || 'Not Specified'} <br>
        <strong>Review:</strong> ${review || 'Not Specified'} <br>
        <strong>Rating:</strong> ${rating || 'Not Specified'} <br>
        <strong>Phone:</strong> ${phoneNumber} <br>
        <strong>Business Name:</strong> ${businessName} <br>
        <strong>Business Email:</strong> ${businessEmail} <br>
        <strong>Injexi Profile Link:</strong> ${injexiProfileLink} <br>
        <strong>Injexi Internal ID:</strong> ${internalId} <br>
        <hr>
        <strong>Page URL:</strong> ${currentURL || 'Not Specified'} <br>
        <strong>Referring Page:</strong> ${referringURL || 'Not Specified'} <br>
      `,
    };
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
}
