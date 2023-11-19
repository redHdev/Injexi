
import { connectDatabase, getDb } from "../../../utilities/mongodb";
import validator from "validator"; 
import { getSession } from "next-auth/react";

// Function to calculate profile completion
const calculateProfileCompletion = (user) => {
  const fields = ['firstName', 'lastName', 'phoneNumber', 'suburb', 'postcode', 'country'];
  let filledFields = 0;

  fields.forEach(field => {
    if (user[field] !== null && user[field] !== undefined && user[field] !== '') {
      filledFields++;
    }
  });

  // Function to calculate profile completion
  const profileCompletion = (filledFields / fields.length) * 100;
  return Math.round(profileCompletion / 5) * 5; // Round to the nearest 5
};

// Function to validate inputs
const validateInputs = (body) => {
  const { email, firstName, lastName, phoneNumber, suburb, postcode, country } = body;

  // Regular expression to check for alphabets and spaces
  const alphaSpaceCheck = new RegExp("^[a-zA-Z ]+$");
  if (
    !validator.isEmail(email) || // Validate email
    !validator.isAlpha(firstName) || // Validate first name
    !validator.isAlpha(lastName) || // Validate last name
    !validator.isMobilePhone(phoneNumber, "any") || // Validate phone number
    !validator.isPostalCode(postcode, "any") || // Validate postcode
    !alphaSpaceCheck.test(suburb) ||
    !alphaSpaceCheck.test(country)
    
  ) {
    return false;
  }
  return true;
};



export default async (req, res) => {
  console.log("Entered updateUserLocation API");
  try {

    const session = await getSession({ req });
    if (!session || !session.user) {
      const signInUrl = createRedirectURL("/account/login", req.url, "redirect_url");
      
      return NextResponse.redirect(signInUrl);
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!validateInputs(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
      });
    }

    await connectDatabase();
    const db = await getDb();
    const collection = db.collection("Users");
    
    const user = await collection.findOne({ email: req.body.email });

    if (user) {
      const currentDateTime = new Date();

      const result = await collection.updateOne(
        { email: req.body.email },
        {
          $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            suburb: req.body.suburb,
            postcode: req.body.postcode,
            country: req.body.country,
            newsletterSubscribed: req.body.newsletterSubscribed,
            updatedAt: currentDateTime,
          },
        }
      );

      if (result.modifiedCount === 1) {
        const updatedUser = await collection.findOne({ email: req.body.email });
        const profileCompletion = calculateProfileCompletion(updatedUser);
        await collection.updateOne(
          { email: req.body.email },
          {
            $set: {
              profileCompletion,
            },
          }
        );

        res.status(200).json({
          success: true,
          message: "Location and profile completion updated successfully.",
          profileCompletion,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Location update failed.",
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
    });
  }
};
