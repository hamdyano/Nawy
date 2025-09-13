import express, { Request, Response } from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

const router = express.Router();

// Define the type for the request body
interface RegisterRequestBody {
  email: string;
  password: string; // Add other expected fields here if necessary
}

router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, password } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       res.status(400).json({ errors: errors.array() });
    }

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
    }

    try {
      let user = await User.findOne({ email });

      if (user) {
         res.status(400).json({ message: "User already exists" });
      }

      user = new User({ firstName, lastName, email, password });
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d", // Token valid for 1 day
        }
      );

      res.status(201).json({
        message: "User registered successfully",
        token, // Include the token in the response
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

export default router;
