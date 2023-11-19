import { connectDatabase, insertClickData } from '/utilities/mongodb'; 
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const session = await getSession({ req });
      if (!session || !session.user) {
        const signInUrl = createRedirectURL("/account/login", req.url, "redirect_url");
        
        return NextResponse.redirect(signInUrl);
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      await connectDatabase();  // Ensure the database is connected

      const data = req.body;
      const result = await insertClickData(data);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error('Failed to insert click data', error);  // Detailed logging
      res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });  // Include error details
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
