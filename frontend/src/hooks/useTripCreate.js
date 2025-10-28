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

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const createNewTrip = async () => {
    setLoading(true);
    setMessage(null);

    const payload = {
      ...formData,
      estimated_budget: Number(formData.estimated_budget) || 0,
      preferences: { additionalProp1: {} },
    };

    try {
      const response = await api.post("/trips", payload);
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
      if (onTripCreated) onTripCreated(response.data);
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
