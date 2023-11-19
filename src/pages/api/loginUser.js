import { connectDatabase, getDb } from "../../../utilities/mongodb";
import bcrypt from "bcryptjs";

export default async (req, res) => {
    try {
        connectDatabase();

        const db = await getDb();
        const collection = db.collection("Users");

        const user = await collection.findOne({ email: req.body.email });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        bcrypt.compare(req.body.password, user.password, function(err, result) {
            if (err) throw err;
        
            if (result) {
                res.status(200).json({ message: 'Login successful', user });
                return;
            } else {
                res.status(401).json({ error: 'Password does not match' });
                return;
            }
        });
      

    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: 'Internal Server Error',
                error: error.message
            }
        );
    }
}