import { getSession } from 'next-auth/react';
import { connectDatabase, getDb } from '/utilities/mongodb';
import createRedirectURL from '@/util/create-redirect';

export default async (req, res) => {
  try {
    // Validate the session
    const session = await getSession({ req });
    if (!session || !session.user) {
      const signInUrl = createRedirectURL("/account/login", req.url, "redirect_url");
      
      return NextResponse.redirect(signInUrl);
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Connect to the MongoDB database
    await connectDatabase();

    // Get the MongoDB database connection object
    const db = await getDb();

    // Access the 'Users' collection
    const collection = db.collection('Users');

    // Extract the email from the session
    const sessionEmail = session.user.email;

    if (!sessionEmail) {
      return res.status(400).json({ success: false, message: 'Email is required to fetch user details' });
    }

    // Find the user based on their email
    const user = await collection.findOne({ email: sessionEmail });

    // If the user is not found
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Return the user details. Note that you can filter the fields you want to return here
    return res.status(200).json({ success: true, user });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};
