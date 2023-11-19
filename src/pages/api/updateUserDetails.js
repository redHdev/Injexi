import { connectDatabase, getDb } from "../../../utilities/mongodb";
import { getSession } from "next-auth/react";


export default async (req, res) => {
  console.log("Entered updateUserDetails API");
  try {
    const session = await getSession({ req });
    if (!session || !session.user) {
      const signInUrl = createRedirectURL("/account/login", req.url, "redirect_url");
      
      return NextResponse.redirect(signInUrl);
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    // Initialize the database connection
    connectDatabase();

    // Connect to the database
    const db = await getDb();
    const collection = db.collection("Users");

    // Find the user by email
    const user = await collection.findOne({ email: req.body.email });

    if (user) {
      // Get the current date and time
      const currentDateTime = new Date();


      // Update the user's details
      const result = await collection.updateOne(
        { email: req.body.email },
        {
          $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            
            updatedAt: currentDateTime, 
          },
        }
      );

      if (result.modifiedCount === 1) {
        res.status(200).json({
          success: true,
          message: "User Details updated successfully.",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "User details update failed.",
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
