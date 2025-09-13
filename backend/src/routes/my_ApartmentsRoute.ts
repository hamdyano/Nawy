import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { body } from "express-validator";
import {  ApartmentType } from "../shared/types";
import verifyToken from "../middleware/authMiddle";
import Apartment from "../models/apartmentModel";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Apartment type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newApartment: ApartmentType = req.body;

      const imageUrls = await uploadImages(imageFiles);

      newApartment.imageUrls = imageUrls;
      newApartment.lastUpdated = new Date();
  
      newApartment.userId = req.userId as string;

      const apartment = new Apartment(newApartment);
      await apartment.save();

      res.status(201).send(apartment);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const apartments = await Apartment.find({ userId: req.userId });
    res.json(apartments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching apartments" });
  }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const apartment = await Apartment.findOne({
      _id: id,
      userId: req.userId,
    });
    res.json(apartment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching apartments" });
  }
});



router.put(
  "/:apartmentId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedApartment: ApartmentType = req.body;
      updatedApartment.lastUpdated = new Date();

      const apartment = await Apartment.findOneAndUpdate(
        {
          _id: req.params.apartmentId,
          userId: req.userId,
        },
        updatedApartment,
        { new: true }
      );

      // Handle the case where the apartment is not found
      if (!apartment) {
        res.status(404).json({ message: "Apartment not found" });
        return; // Exit the function early
      }

      const files = req.files as Express.Multer.File[];
      const updatedImageUrls = await uploadImages(files);

      apartment.imageUrls = [
        ...updatedImageUrls,
        ...(updatedApartment.imageUrls || []),
      ];

      await apartment.save();
      res.status(201).json(apartment);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);


async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

export default router; 