"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import * as apiClient from "@/utils/api-client";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "@/forms/GuestInfoFormFile/GuestInfoForm";

// Optionally, define the type for apartment
type Apartment = {
  _id: string;
  name: string;
  starRating: number;
  imageUrls: string[];
  facilities: string[];
  description: string;
  price: number;
};

const DetailPage = () => {
  const params = useParams();
  // For dynamic routes, use the correct param key (e.g. 'id' or 'apartmentId')
  // If your route is src/app/detail/[apartmentId]/page.tsx, use params.apartmentId
  const apartmentId = params?.apartmentId as string | undefined;

  const {
    data: apartment,
    isLoading,
    error,
  } = useQuery<Apartment>({
    queryKey: ["fetchApartmentById", apartmentId],
    queryFn: () => apiClient.fetchApartmentById(apartmentId || ""),
    enabled: !!apartmentId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading apartment.</div>;
  if (!apartment) return null;

  return (
    <div className="space-y-6">
      <div>
        <span className="flex">
          {Array.from({ length: apartment.starRating }).map((_, i) => (
            <AiFillStar key={i} className="fill-yellow-400" />
          ))}
        </span>
        <h1 className="text-3xl font-bold">{apartment.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {apartment.imageUrls.map((image, i) => (
          <div key={i} className="h-[300px]">
            <img
              src={image}
              alt={apartment.name}
              className="rounded-md w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {apartment.facilities.map((facility, i) => (
          <div key={i} className="border border-slate-300 rounded-sm p-3">
            {facility}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <div className="whitespace-pre-line">{apartment.description}</div>
        <div className="h-fit">
          <GuestInfoForm
            price={apartment.price}
            apartmentId={apartment._id}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailPage;