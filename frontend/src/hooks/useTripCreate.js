import { useState } from "react";
import api from "../api/axiosInstance";

export function useTripCreate({onTripCreated}) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    destination: "",
    start_date: "",
    end_date: "",
    estimated_budget: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const createNewTrip = async (user_id) => {
    setLoading(true);
    setMessage(null);

    const payload = {
      ...formData,
      estimated_budget: Number(formData.estimated_budget) || 0,
      preferences: { additionalProp1: {} },
    };

    try {
      const response = await api.post(`/trips/${user_id}`, payload);
      setMessage({ type: "success", text: "Trip created successfully!" });
      setFormData({
        title: "",
        category: "",
        destination: "",
        start_date: "",
        end_date: "",
        estimated_budget: "",
        notes: "",
      });
      if (onTripCreated) onTripCreated(response.data); //call back function to set form data 
    } catch (error) {
      console.error("Error creating trip:", error);
      setMessage({
        type: "error",
        text: "Failed to create trip. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return { formData, setFormData, loading, message, createNewTrip };
}
