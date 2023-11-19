import { connectDatabase, getDb } from '/utilities/mongodb';

export default async (req, res) => {
  try {
    await connectDatabase();

    const db = await getDb();
    const collection = db.collection('BusinessMasterlistCollection');

    // Fetch the 'Injexi Profile Link' and 'updatedAt' fields for all businesses.
    const data = await collection.find({}, { projection: { 'businessDetails.Injexi Profile Link': 1, 'updatedAt': 1 } }).toArray();

    // Transform the data to the desired format.
    const sitemapLinks = data.map(doc => {
      const injexiProfileLink = doc.businessDetails['Injexi Profile Link'];
      const updatedAt = doc.updatedAt;
      return {
        loc: `${process.env.NEXT_PUBLIC_API_BASE_URL}/au/${injexiProfileLink}`,
        lastmod: updatedAt.toISOString().split('T')[0]  // Format date as YYYY-MM-DD
      };
    });

    res.status(200).json({ success: true, sitemapLinks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};
