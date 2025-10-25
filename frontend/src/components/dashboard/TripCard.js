import React from "react";
import { useTripLoader } from "../../hooks/useTripLoader";

function TripCard({ trip_id }) {
  const { trip, loading, error, loadTrip } = useTripLoader(trip_id);
  const handleReload = () => {
    loadTrip(trip_id);
  };
  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  return (
    <div className="card shadow-sm mb-3" style={{ borderColor: "#ffd6e8" }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0 fw-bold">{trip.title}</h5>
          <span
            className="badge"
            style={{ backgroundColor: "#ffd6e8", color: "#333" }}
          >
            {trip.category}
          </span>
        </div>

        <div className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-geo-alt me-2"
              viewBox="0 0 16 16"
            >
              <path d="M12.166 8.94C12.665 8.118 13 7.208 13 6a5 5 0 1 0-10 0c0 1.208.335 2.118.834 2.94C5.62 10.948 7.1 13.01 8 14c.9-.99 2.38-3.052 4.166-5.06zM8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
            </svg>
            <span>{trip.destination}</span>
          </div>

          <div className="d-flex align-items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-calendar-event me-2"
              viewBox="0 0 16 16"
            >
              <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
            </svg>
            <span>
              {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
            </span>
          </div>

          <div className="d-flex align-items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-currency-dollar me-2"
              viewBox="0 0 16 16"
            >
              <path
                d="M8.5 4.5a.5.5 0 0 0-1 0v.635c-.712.097-1.428.26-2.07.488-.41.154-.79.34-1.13.554V6a.5.5 0 0 0 1 0v-.545c.34-.204.708-.36 1.11-.474.642-.23 1.358-.39 2.07-.487V7H6a.5.5 0 0 0 0 1h2v3H6a.5.5 0 0 0 0 1 0-1h1.5v-.635c.712-.097 1.428-.26 2.07-.488.41-.154.79-.34 1.13-.554V10a.5.5 0 0 0-1 0v.545c-.34.204-.708.36-1.11.474-.642.23-1.358.39-2.07.487V9H10a.5.5 0 0 0 0-1H8V5h2a.5.5 0 0 0 0-1H8.5V4.5z"
              />
            </svg>
            <span>Budget: ${trip.budget}</span>
          </div>

          {/* New Fields */}
          {/* <div className="d-flex align-items-center mb-2">
            <strong>Status:</strong> <span className="ms-2">{trip.status}</span>
          </div>
          <div className="d-flex align-items-center mb-2">
            <strong>Accommodation:</strong> <span className="ms-2">{trip.accommodation}</span>
          </div>
          <div className="d-flex align-items-center mb-2">
            <strong>Itineraries:</strong> <span className="ms-2">{trip.itineraries.join(", ")}</span>
          </div> */}

          <div className="d-flex justify-content-between align-items-center">
            {trip.booking_ref && (
              <small className="text-muted">
                Booking Ref: {trip.booking_ref}
              </small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripCard;
