"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import * as apiClient from "@/utils/api-client";
import { useAppContext } from "@/contexts/AppContext";
import ManageApartmentForm from "@/forms/ManageApartmentFormFile/ManageApartmentForm";
import { ApartmentType } from "../../../../backend/src/shared/types";


const EditApartmentPage = () => {
  const params = useParams();
  const apartmentId = (params as { apartmentId?: string })?.apartmentId;

  const { showToast } = useAppContext();

 
  const {
    data: apartment,
    isLoading: isApartmentLoading,
    error: apartmentError,
  } = useQuery<ApartmentType>({
    queryKey: ["fetchMyApartmentById", apartmentId],
    queryFn: () => apiClient.fetchMyApartmentById(apartmentId ?? ""),
    enabled: !!apartmentId,
  });

  const { mutate, isPending: isUpdating } = useMutation({
    mutationFn: apiClient.updateMyApartmentById,
    onSuccess: () => {
      showToast({ message: "Apartment Saved!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Error Saving Apartment", type: "ERROR" });
    },
  });

  const handleSave = (apartmentFormData: FormData) => {
    mutate(apartmentFormData);
  };

  if (isApartmentLoading) return <div>Loading...</div>;
  if (apartmentError) return <div>Error loading apartment.</div>;
  if (!apartment) return <div>No apartment found.</div>;

  return (
    <ManageApartmentForm
      apartment={apartment}
      onSave={handleSave}
      isLoading={isUpdating}
    />
  );
};

export default EditApartmentPage;