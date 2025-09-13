"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchContext } from "@/contexts/SearchContext";
import * as apiClient from "@/utils/api-client";
import { useState } from "react";

import SearchResultsCard from "@/components/SearchResultsCard";
import StarRatingFilter from "@/components/StarRatingFilter";
import FacilitiesFilter from "@/components/FacilitiesFilter";
import PriceFilter from "@/components/PriceFilter";
import Pagination from "@/components/Pagination";
import ApartmentTypesFilter from "@/components/ApartmentTypesFilter";
import { ApartmentType } from "../../../../backend/src/shared/types";

const SearchPage = () => {
  const search = useSearchContext();
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedApartmentTypes, setSelectedApartmentTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOption, setSortOption] = useState<string>("");

  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    page: page.toString(),
    stars: selectedStars,
    types: selectedApartmentTypes,
    facilities: selectedFacilities,
    maxPrice: selectedPrice?.toString(),
    sortOption,
  };

  const { data: apartmentData } = useQuery({
    queryKey: ["searchApartments", searchParams],
    queryFn: () => apiClient.searchApartments(searchParams),
  });

  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;
    setSelectedStars((prevStars) =>
      event.target.checked
        ? [...prevStars, starRating]
        : prevStars.filter((star) => star !== starRating)
    );
  };

  const handleApartmentTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const apartmentType = event.target.value;
    setSelectedApartmentTypes((prevTypes) =>
      event.target.checked
        ? [...prevTypes, apartmentType]
        : prevTypes.filter((type) => type !== apartmentType)
    );
  };

  const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const facility = event.target.value;
    setSelectedFacilities((prevFacilities) =>
      event.target.checked
        ? [...prevFacilities, facility]
        : prevFacilities.filter((prevFacility) => prevFacility !== facility)
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter by:
          </h3>
          <StarRatingFilter
            selectedStars={selectedStars}
            onChange={handleStarsChange}
          />
          <ApartmentTypesFilter
            selectedApartmentTypes={selectedApartmentTypes}
            onChange={handleApartmentTypeChange}
          />
          <FacilitiesFilter
            selectedFacilities={selectedFacilities}
            onChange={handleFacilityChange}
          />
          <PriceFilter
            selectedPrice={selectedPrice}
            onChange={(value?: number) => setSelectedPrice(value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {apartmentData?.pagination.total ?? 0} Apartments found
            {search.destination ? ` in ${search.destination}` : ""}
          </span>
          <select
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Sort By</option>
            <option value="starRating">Star Rating</option>
            <option value="pricePerNightAsc">Price (low to high)</option>
            <option value="pricePerNightDesc">Price (high to low)</option>
          </select>
        </div>
        {(apartmentData?.data ?? []).map((apartment: ApartmentType) => (
          <SearchResultsCard key={apartment._id} apartment={apartment} />
        ))}
        <div>
          <Pagination
            page={apartmentData?.pagination.page || 1}
            pages={apartmentData?.pagination.pages || 1}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;