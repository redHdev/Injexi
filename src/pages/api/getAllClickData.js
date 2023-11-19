import { connectDatabase, getDb } from '/utilities/mongodb';
import { getSession } from 'next-auth/react';

export default async (req, res) => {
  try {

    const session = await getSession({ req });
    if (!session || !session.user) {
      const signInUrl = createRedirectURL("/account/login", req.url, "redirect_url");
      
      return NextResponse.redirect(signInUrl);
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    await connectDatabase();

    const db = await getDb();
    const collection = db.collection('ClickData');

    const data = await collection.find({}).toArray(); // This fetches all documents. Adjust query as necessary.
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};
