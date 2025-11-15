import { useState } from "react";
import api from "../api/axiosInstance";

export function useUpdateItinerary() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Accepts day_id and partial payload
  const updateItinerary = async (day_id, payload) => {
    setLoading(true);
    setError(null);
    try {
      // Use PATCH if your backend supports partial updates:
      const res = await api.patch(`/itineraries/days/${day_id}/`, payload);
      return res.data;
    } catch (err) {
      setError(err?.response?.data || "Failed to update itinerary day");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateItinerary, loading, error };
}
