import bcrypt from "bcryptjs";
import validator from "validator";
import { connectDatabase, getDb } from "../../../utilities/mongodb";

console.log("About to validate input");

const validateInput = (email, oldPassword, newPassword) => {
    const errors = [];
    if (!validator.isEmail(email)) {
        errors.push({ msg: "Invalid email format" });
    }
    if (!validator.isLength(oldPassword, { min: 8 })) {
        errors.push({ msg: "Old password should be at least 8 characters long" });
    }
    if (!validator.isLength(newPassword, { min: 8 })) {
        errors.push({ msg: "New password should be at least 8 characters long" });
    }

    console.log("Validation Errors:", errors);
    return errors;
};

export default async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        // Validate and sanitize the inputs
        const errors = validateInput(email, oldPassword, newPassword);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        // Connect to the database
        connectDatabase();
        const db = await getDb();
        const collection = db.collection("Users");

        const user = await collection.findOne({ email: email });

        if (user) {
            const checkOldPassword = await bcrypt.compare(oldPassword, user.password);

            if (checkOldPassword) {
                const newPasswordHash = await bcrypt.hash(newPassword, 10);
                const currentDateTime = new Date();

                const result = await collection.updateOne(
                    { email: email },
                    {
                        $set: {
                            password: newPasswordHash,
                            updatedAt: currentDateTime,
                        },
                    }
                );

                if (result.modifiedCount === 1) {
                    return res.status(200).json({
                        success: true,
                        message: "Password updated successfully.",
                    });
                } else {
                    return res.status(500).json({
                        success: false,
                        message: "Password update failed.",
                    });
                }
            } else {
                return res.status(401).json({
                    success: false,
                    message: "Incorrect old password.",
                });
            }
        } else {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
