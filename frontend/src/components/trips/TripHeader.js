import { formatTime, formatDate } from "../../utils/utils";
import { useState } from "react";
import "../../assets/TripCard.css";
export default function TripHeader({ trip }) {
  return (
    <div className="trip-header">
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
            <path d="M8 1c-.552 0-1 .448-1 1v1.071C5.127 3.39 3.39 5.127 3.071 7H2a1 1 0 1 0 0 2h1.071c.319 1.873 2.056 3.61 3.929 3.929V14a1 1 0 1 0 2 0v-1.071c1.873-.319 3.61-2.056 3.929-3.929H14a1 1 0 1 0 0-2h-1.071c-.319-1.873-2.056-3.61-3.929-3.929V2a1 1 0 0 0-1-1zM8 5c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2z" />
          </svg>
          <span>Budget: ${trip.estimated_budget || 0}</span>
        </div>

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
