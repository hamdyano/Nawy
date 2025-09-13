import express, { Request, Response } from "express";
import { ApartmentSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import Apartment from "../models/apartmentModel";

const router = express.Router();

// Search apartments by name, city, country, or general query
router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "priceAsc":
        sortOptions = { price: 1 };
        break;
      case "priceDesc":
        sortOptions = { price: -1 };
        break;
    }

    const pageSize = 5;
    const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
    const skip = (pageNumber - 1) * pageSize;

    const apartments = await Apartment.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Apartment.countDocuments(query);

    const response: ApartmentSearchResponse = {
      data: apartments,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Get all apartments
router.get("/", async (req: Request, res: Response) => {
  try {
    const apartments = await Apartment.find().sort("-lastUpdated");
    res.json(apartments);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching apartments" });
  }
});

// Get apartment by ID
router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Apartment ID is required")],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const id = req.params.id.toString();

    try {
      const apartment = await Apartment.findById(id);
      res.json(apartment);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching apartment" });
    }
  }
);

// Construct a flexible search query for apartments
const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  // Search by apartment name (case-insensitive, partial match)
  if (queryParams.name) {
    constructedQuery.name = new RegExp(queryParams.name, "i");
  }

  // General query: matches name, city, or country
  if (queryParams.q) {
    constructedQuery.$or = [
      { name: new RegExp(queryParams.q, "i") },
      { city: new RegExp(queryParams.q, "i") },
      { country: new RegExp(queryParams.q, "i") },
    ];
  }

  // Search by city/country using "destination"
  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : [parseInt(queryParams.stars)];
    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.price = {
      $lte: parseInt(queryParams.maxPrice),
    };
  }

  return constructedQuery;
};

export default router;