import React from 'react';
import { useTripLoader } from '../hooks/useTripLoader';


function TripsUI ({ trip_id }) { 
  
  // 1. Use the custom hook(TripLoader) to get state and functions
  const { trip, loading, error, loadTrip } = useTripLoader(trip_id);
  
  // Helper to trigger reload with the current prop ID
  const handleReload = () => {
    // THE FIX: Call the function (loadTrip) returned by the hook,
    //    NOT the hook (useTripLoader) itself.
    //useTripLoader(trip_id);
    loadTrip(trip_id);
  }

  return (
    <div>
      <button onClick={handleReload} disabled={loading || trip_id == null}>
        {loading ? "Loading..." : "Reload Trip Data"}
      </button>
      
      {/* 3. Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {/* 4. Trip Data Display */}
      {trip ? (
        <ul>
          {/* Display trip details here */}
          <li>Trip Found!</li>
          <li>ID: {trip.id}</li>
          <li>Title: {trip.title}</li>
          <li>Category: {trip.category}</li>
          <li>Destination: {trip.destination}</li>
        </ul>
      ) : (
        // 5. No Data/Initial State Message
        !loading && !error && <p>Select a trip ID to load or reload data.</p>
      )}
      
      {/* Optional: Show message if no ID is passed */}
      {trip_id == null && <p>Please provide a valid `trip_id` prop.</p>}
    </div>
  );
}

export default TripsUI;