export default function ItineraryPanel({ trip }) {
  const handleAddDay = () => {
    // hook/API call later
    console.log("Add Day clicked");
  };

  return (
    <div className="itinerary-panel">
      <div className="itinerary-header">
        <h4>Trip Itinerary</h4>
         <button className="add-day-btn" onClick={handleAddDay}>
            ➕ Add Day
        </button>
        
      </div>

      {/* 🔁 You can move your existing accordion logic here */}
      <div className="itinerary-days">
        
        {/* map days */}
      </div>
    </div>
  );
}
