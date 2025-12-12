import { useState ,useEffect} from "react";
import api from "../api/axiosInstance";


export function useUserTrips(userId) {
    const [trips, setTrips] = useState([]);
    const [error, setError] = useState(null);
    // const [itineraryLoading, setItineraryLoading] = useState(false);

    const loadtrips = async (userId) => {
    if(!userId) return;
    try {
      const response = await api.get(`/trips/user/${userId}/`);
      setTrips(response.data);
    } catch (err) {
      if (err.response?.status === 400) {
        setError("Itinerary not found.");
      } else {
        setError("An error occurred while loading Itinerary.");
      }
      setTrips(null);
    } 
    
  };

  useEffect(() => {
    if (userId != null) {
      loadtrips(userId);
    } else {
      setTrips(null);
    }
  }, [userId]);
    return {trips};
}

