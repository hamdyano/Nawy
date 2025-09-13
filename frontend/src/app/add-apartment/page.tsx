"use client";

import { useMutation } from "@tanstack/react-query";
import { useAppContext } from "@/contexts/AppContext";
import * as apiClient from "@/utils/api-client";
import ManageApartmentForm from "@/forms/ManageApartmentFormFile/ManageApartmentForm";

const AddApartmentPage = () => {
  const { showToast } = useAppContext();

  const { mutate, isPending } = useMutation({
    mutationFn: apiClient.addMyApartment,
    onSuccess: () => {
      showToast({ message: "Apartment Saved!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Error Saving Apartment", type: "ERROR" });
    },
  });

  // This matches the expected parameter of the mutation function
  const handleSave = (apartmentFormData: FormData) => {
    mutate(apartmentFormData);
  };

  return (
    <ManageApartmentForm onSave={handleSave} isLoading={isPending} />
  );
};

export default AddApartmentPage;