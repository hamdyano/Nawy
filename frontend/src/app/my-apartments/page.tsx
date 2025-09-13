"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import * as apiClient from "@/utils/api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";
import { ApartmentType } from "../../../../backend/src/shared/types";

const MyApartmentsPage = () => {
  const { data: apartmentData, isLoading } = useQuery<ApartmentType[]>({
    queryKey: ["fetchMyApartments"],
    queryFn: apiClient.fetchMyApartments,
  });

  // Show loading state if desired
  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <div className="space-y-5">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">My Apartments</h1>
        <Link
          href="/add-apartment"
          className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
        >
          Add Apartment
        </Link>
      </span>
      {(!apartmentData || apartmentData.length === 0) ? (
        <span>No Apartments found</span>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {apartmentData.map((apartment) => (
            <div
              key={apartment._id}
              data-testid="apartment-card"
              className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5"
            >
              <h2 className="text-2xl font-bold">{apartment.name}</h2>
              <div className="whitespace-pre-line">{apartment.description}</div>
              <div className="grid grid-cols-5 gap-2">
                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                  <BsMap className="mr-1" />
                  {apartment.city}, {apartment.country}
                </div>
                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                  <BsBuilding className="mr-1" />
                  {apartment.type}
                </div>
                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                  <BiMoney className="mr-1" />£{apartment.price}
                </div>
                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                  <BiHotel className="mr-1" />
                  {apartment.adultCount} adults, {apartment.childCount} children
                </div>
                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                  <BiStar className="mr-1" />
                  {apartment.starRating} Star Rating
                </div>
              </div>
              <span className="flex justify-end">
                <Link
                  href={`/edit-apartment/${apartment._id}`}
                  className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
                >
                  View Details
                </Link>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApartmentsPage;