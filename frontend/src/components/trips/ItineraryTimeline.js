
import "../../assets/TripCard.css";
export default function ItineraryTimeline({ itinerary }) {
  if (!itinerary.length) {
    return (
      <div className="timeline empty">
        <p>No itinerary yet</p>
      </div>
    );
  }

  return (
    <div className="timeline">
      {itinerary.map((day, index) => (
        <div key={day.id} className="timeline-node">
          <div className="circle">{index + 1}</div>
          <div className="label">
            <strong>Day {index + 1}</strong>
            <p>{day.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
