"use client";

import React, { useContext, useState, useEffect } from "react";

type SearchContextType = {
  destination: string;
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  apartmentId: string;
  saveSearchValues: (
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adultCount: number,
    childCount: number,
    apartmentId?: string
  ) => void;
};

const SearchContext = React.createContext<SearchContextType | undefined>(undefined);

type SearchContextProviderProps = {
  children: React.ReactNode;
};

export const SearchContextProvider = ({ children }: SearchContextProviderProps) => {
  // Provide safe defaults for SSR, then hydrate from sessionStorage on client
  const [destination, setDestination] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date>(new Date());
  const [checkOut, setCheckOut] = useState<Date>(new Date());
  const [adultCount, setAdultCount] = useState<number>(1);
  const [childCount, setChildCount] = useState<number>(1);
  const [apartmentId, setApartmentId] = useState<string>("");

  // Hydrate from sessionStorage when running in browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDestination = sessionStorage.getItem("destination");
      const storedCheckIn = sessionStorage.getItem("checkIn");
      const storedCheckOut = sessionStorage.getItem("checkOut");
      const storedAdultCount = sessionStorage.getItem("adultCount");
      const storedChildCount = sessionStorage.getItem("childCount");
      const storedApartmentId = sessionStorage.getItem("apartmentId");

      if (storedDestination) setDestination(storedDestination);
      if (storedCheckIn) setCheckIn(new Date(storedCheckIn));
      if (storedCheckOut) setCheckOut(new Date(storedCheckOut));
      if (storedAdultCount) setAdultCount(parseInt(storedAdultCount, 10));
      if (storedChildCount) setChildCount(parseInt(storedChildCount, 10));
      if (storedApartmentId) setApartmentId(storedApartmentId);
    }
  }, []);

  const saveSearchValues = (
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adultCount: number,
    childCount: number,
    apartmentId?: string
  ) => {
    setDestination(destination);
    setCheckIn(checkIn);
    setCheckOut(checkOut);
    setAdultCount(adultCount);
    setChildCount(childCount);
    if (apartmentId) {
      setApartmentId(apartmentId);
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem("destination", destination);
      sessionStorage.setItem("checkIn", checkIn.toISOString());
      sessionStorage.setItem("checkOut", checkOut.toISOString());
      sessionStorage.setItem("adultCount", adultCount.toString());
      sessionStorage.setItem("childCount", childCount.toString());
      if (apartmentId) {
        sessionStorage.setItem("apartmentId", apartmentId);
      }
    }
  };

  return (
    <SearchContext.Provider
      value={{
        destination,
        checkIn,
        checkOut,
        adultCount,
        childCount,
        apartmentId,
        saveSearchValues,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchContextProvider");
  }
  return context;
};