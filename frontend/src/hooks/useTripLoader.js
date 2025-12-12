import { useEffect, useState } from "react";
import api from "../api/axiosInstance";

export function useTripLoader (trip_id) {
  const [trip, setTrip] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTrip = async (trip_id) => {
    if(!trip_id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/trips/${trip_id}`);
      setTrip(response.data);
      
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Trip not found.");
      } else {
        setError("An error occurred while loading trips.");
      }
      setTrip(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trip_id != null) {
      loadTrip(trip_id);
    } else {
      setTrip(null);
      setError(null);
    }
  }, [trip_id]);

  return {trip, loading, error,loadTrip}
}