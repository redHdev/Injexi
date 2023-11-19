import { connectDatabase, getDb } from '/utilities/mongodb';

export default async (req, res) => {
  try {
    await connectDatabase();

    const db = await getDb();
    const collection = db.collection('BlogPosts');

    // Fetch the 'slug' and 'lastUpdated' fields for all service categories.
    const data = await collection.find({}, { projection: { 'slug': 1, 'lastUpdated': 1 } }).toArray();

    // Transform the data to the desired format.
    const sitemapLinks = data.map(doc => {
      const slug = doc.slug;
      const lastUpdated = doc.lastUpdated;

      return {
        loc: `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog/${slug}`,
        lastmod: lastUpdated.toISOString().split('T')[0]  // Format date as YYYY-MM-DD
      };
    });

    res.status(200).json({ success: true, sitemapLinks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};
