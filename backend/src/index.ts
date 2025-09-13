import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/usersRoute";
import authRoutes from "./routes/authRoute";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import ApartmentsRoute from "./routes/ApartmentsRoute";
import my_ApartmentsRoute from "./routes/my_ApartmentsRoute";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => console.log("connected to database"));

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



  app.use(
    cors({
      origin: "http://localhost:3000", // Frontend origin
      credentials: true, // Allow credentials (cookies) to be sent
    })
  );
  



//app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-apartments", my_ApartmentsRoute);
app.use("/api/apartments", ApartmentsRoute);
//app.use("/api/my-bookings", bookingRoutes); 

/*app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});*/



app.listen(7000, () => {
  console.log("server running on localhost:7000");
});

