"use client";


import { useEffect, useState } from "react";
import SearchResultsCard from "../components/SearchResultsCard";
import { ApartmentType } from "../../../backend/src/shared/types";
import { fetchAllApartments } from "@/utils/api-client";

const HomePage = () => {
  const [apartments, setApartments] = useState<ApartmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllApartments()
      .then(setApartments)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading apartments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-6 p-8">
      {apartments.map((apartment) => (
        <SearchResultsCard key={apartment._id} apartment={apartment} />
      ))}
    </div>
  );
};

export default HomePage;