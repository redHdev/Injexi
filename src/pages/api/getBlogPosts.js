import { connectDatabase, getDb } from "/utilities/mongodb";

export default async (req, res) => {
  try {
    // Connect to your database
    await connectDatabase();

    // Get the database instance
    const db = await getDb();

    // Get the collection where your blog posts are stored
    const collection = db.collection("BlogPosts");

    // Get the slug from the query parameters
    const { slug } = req.query;

    // Set up a query object, which will either find a post with the specific slug or return all posts if no slug is provided
    const query = slug ? { slug: slug } : {};

    // Find blog posts using the query object
    const blogPosts = await collection.find(query).toArray();

    if (blogPosts.length > 0) {
      // If blog posts are found, return them in the response
      res.status(200).json({ success: true, data: blogPosts });
    } else {
      // If no blog posts are found, return a 404 status with an appropriate message
      res.status(404).json({ success: false, message: "No blog posts found" });
    }
  } catch (error) {
    // If an error occurs, return a 500 status with the error message
    res.status(500).json({
      success: false,
      message: "Internal Server Error Test",
      error: error.message,
    });
  }
};
