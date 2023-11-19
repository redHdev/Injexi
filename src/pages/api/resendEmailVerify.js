// pages/api/resendVerifyEmail.js
import { getUsersCollection, connectDatabase } from 'utilities/mongodb.js';
import { sendVerificationEmail } from './sendEmailVerify';

export default async (req, res) => {
  await connectDatabase();

  if (req.method === 'POST') {
    const { email } = req.body;

    const usersCollection = await getUsersCollection();

    // Find the user by email and check if their email is pending verification
    const user = await usersCollection.findOne({ email, isEmailPendingVerification: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found or already verified' });
    }

    // Resend the email with the same verification token
    const { success, message } = await sendVerificationEmail(email, user.verificationToken);

    if (success) {
      return res.status(200).json({ message });
    } else {
      return res.status(500).json({ message });
    }
  } else {
    // Method not allowed
    res.status(405).end();
  }
};
