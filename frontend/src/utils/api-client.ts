import { ApartmentSearchResponse, ApartmentType } from "../../../backend/src/shared/types";
import type { RegisterFormData } from "@/app/register/page";  
import type { SignInFormData } from "@/app/sign-in/page";    

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token invalid");
  }

  return response.json();
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Error during sign out");
  }
};

export const fetchAllApartments = async (): Promise<ApartmentType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/apartments`);
  if (!response.ok) {
    throw new Error("Error fetching apartments");
  }
  return response.json();
};

export const addMyApartment = async (apartmentFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-apartments`, {
    method: "POST",
    credentials: "include",
    body: apartmentFormData,
  });

  if (!response.ok) {
    throw new Error("Failed to add apartment");
  }

  return response.json();
};

export const fetchMyApartments = async (): Promise<ApartmentType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-apartments`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching apartments");
  }

  return response.json();
};

export const fetchMyApartmentById = async (apartmentId: string): Promise<ApartmentType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-apartments/${apartmentId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching Apartments");
  }

  return response.json();
};

export const updateMyApartmentById = async (apartmentFormData: FormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-apartments/${apartmentFormData.get("apartmentId")}`,
    {
      method: "PUT",
      body: apartmentFormData,
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Apartment");
  }

  return response.json();
};

export type SearchParams = {
  name?: string;
  q?: string;
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adultCount?: string;
  childCount?: string;
  page?: string;
  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOption?: string;
};

export const searchApartments = async (
  searchParams: SearchParams
): Promise<ApartmentSearchResponse> => {
  const queryParams = new URLSearchParams();
  // NEW: Add name & q support for backend
  if (searchParams.name) queryParams.append("name", searchParams.name);
  if (searchParams.q) queryParams.append("q", searchParams.q);

  queryParams.append("destination", searchParams.destination || "");
  queryParams.append("checkIn", searchParams.checkIn || "");
  queryParams.append("checkOut", searchParams.checkOut || "");
  queryParams.append("adultCount", searchParams.adultCount || "");
  queryParams.append("childCount", searchParams.childCount || "");
  queryParams.append("page", searchParams.page || "");
  queryParams.append("maxPrice", searchParams.maxPrice || "");
  queryParams.append("sortOption", searchParams.sortOption || "");

  searchParams.facilities?.forEach((facility) =>
    queryParams.append("facilities", facility)
  );

  searchParams.types?.forEach((type) => queryParams.append("types", type));
  searchParams.stars?.forEach((star) => queryParams.append("stars", star));

  const response = await fetch(
    `${API_BASE_URL}/api/apartments/search?${queryParams}`
  );

  if (!response.ok) {
    throw new Error("Error fetching apartments");
  }

  return response.json();
};

export const fetchApartmentById = async (apartmentId: string): Promise<ApartmentType> => {
  const response = await fetch(`${API_BASE_URL}/api/apartments/${apartmentId}`);
  if (!response.ok) {
    throw new Error("Error fetching Apartments");
  }
  return response.json();
};