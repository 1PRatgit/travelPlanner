import { useState ,useEffect} from "react";
import api from "../api/axiosInstance";


export function useEditActivity(activiity_id) {
    const [itinerary, setItinerary] = useState(null);
    const [error, setError] = useState(null);
    const [itineraryLoading, setItineraryLoading] = useState(false);

    const loadItinerary = async (trip_id) => {
    if(!trip_id) return;
    try {
      const response = await api.get(`/activities/${activiity_id}/`);
      setItinerary(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Itinerary not found.");
      } else {
        setError("An error occurred while loading Itinerary.");
      }
      setItinerary(null);
    } 
    finally {
      setItineraryLoading(false);
    }
  };

  useEffect(() => {
    if (activiity_id != null) {
      loadItinerary(activiity_id);
    } else {
      setItinerary(null);
      setError(null);
    }
  }, [activiity_id]);
    return {itinerary, itineraryLoading,error};
}

