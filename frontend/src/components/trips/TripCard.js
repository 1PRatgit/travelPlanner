import TripHeader from "./TripHeader";
import ItineraryPanel from "./ItineraryPanel";
// import ItineraryTimeline from "./ItineraryTimeline";
import "../../assets/styles/TripCardV2.css";

export default function TripCardV2({ trip }) {
  return (
    <div className="trip-card-v2">
      <TripHeader trip={trip} />

      <div className="trip-content">
        {/* LEFT: Itinerary */}
        <ItineraryPanel trip={trip} />

        {/* RIGHT: Visual Diagram */}
        <ItineraryTimeline itinerary={trip.itinerary || []} />
      </div>
    </div>
  );
}
