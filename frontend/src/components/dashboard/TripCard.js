import { useState } from "react";
import { useTripLoader } from "../../hooks/useTripLoader";
import { useItineraryLoader } from "../../hooks/useItineraryLoader";
import {formatTime,formatDate} from "../../utils/utils"
import { ItineraryCreate } from "../tripForm/ItineraryCreate";

function TripCard({ trip_id }) {
  const { trip, loading, error, loadTrip } = useTripLoader(trip_id);
  const [showItinerary, setShowItinerary] = useState(false);

  const {
    itinerary,
    itineraryLoading,
    error: itineraryError, 
  } = useItineraryLoader(showItinerary ? trip?.id : null);

  
  if (loading) return <div>Loading trip...</div>;
  if (error) return <div>Error loading trip.</div>;
  const toggleItinerary = () => {
    setShowItinerary((prev) => !prev);
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
              <path d="M8 1c-.552 0-1 .448-1 1v1.071C5.127 3.39 3.39 5.127 3.071 7H2a1 1 0 1 0 0 2h1.071c.319 1.873 2.056 3.61 3.929 3.929V14a1 1 0 1 0 2 0v-1.071c1.873-.319 3.61-2.056 3.929-3.929H14a1 1 0 1 0 0-2h-1.071c-.319-1.873-2.056-3.61-3.929-3.929V2a1 1 0 0 0-1-1zM8 5c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2z"/>
            </svg>
            <span>Budget: ${(trip.estimated_budget) || 0}</span>
            

          </div>

          <div className="d-flex justify-content-between align-items-center">
            {trip.booking_ref && (
              <small className="text-muted">
                Booking Ref: {trip.booking_ref}
              </small>
            )}
          </div>

          {/* Itinerary Toggle Button */}
          <button
            className="btn btn-rose mt-3"
            onClick={toggleItinerary}
            disabled={!trip}
          >
            {showItinerary ? "Hide Itinerary" : "View Itinerary"}
          </button>
          {console.log(itinerary)}
          {showItinerary && (
            <div className="mt-3">
              {itineraryLoading && <p>Loading Itinerary...</p>}
              {itineraryError && (
                <p className="text-danger">Error loading itinerary.</p>
              )}
              {!itineraryLoading && itinerary && itinerary.length > 0 && (
                <div className="accordion" id={`accordion-${itinerary}`}>
                  {itinerary.map((day, index) => (
                    <div className="accordion-item" key={index}>
                      <h2 className="accordion-header" id={`heading-${itinerary}-${index}`}>
                        <button
                          className={`accordion-button ${
                            index > 0 ? "collapsed" : ""
                          }`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse-${itinerary.trip_id}-${index}`}
                          aria-expanded={index === 0 ? "true" : "false"}
                          aria-controls={`collapse-${trip.trip_id}-${index}`}
                        >
                          Day {index + 1} - {day.date}
                        </button>
                      </h2>
                      <div
                        id={`collapse-${trip.trip_id}-${index}`}
                        className={`accordion-collapse collapse ${
                          index === 0 ? "show" : ""
                        }`}
                        aria-labelledby={`heading-${index}`}
                        data-bs-parent={`#accordion-${trip.trip_id}`}
                      >
                        <div className="accordion-body">
                         {/* // ... inside the accordion-body */}

                          {day.activities_in_day && day.activities_in_day.length > 0 ? (
                            <ul className="list-group">
                              {day.activities_in_day.map((activity, idx) => (
                                <li className="list-group-item activity-item" key={idx}>
                                  <div className="d-flex justify-content-between align-items-start flex-wrap">
                                    {/* Section 1: Title, Category, and Status */}
                                    <div className="activity-main-info me-3">
                                      <h5 className="mb-1 activity-title">
                                        {activity.title}
                                        <span className={`badge ms-2 ${activity.is_completed ? 'bg-success' : 'bg-warning text-dark'}`}>
                                          {activity.is_completed ? 'Completed' : 'Pending'}
                                        </span>
                                      </h5>
                                      <p className="activity-category">
                                        <i className="bi bi-tag-fill me-1"></i>
                                        {activity.category}
                                      </p>
                                    </div>

                                    {/* Section 2: Time and Location */}
                                    {console.log(activity.start_time)}
                                    <div className="activity-details text-end">
                                     <p className="activity-time fw-bold text-primary mb-0">
                                        {formatTime(day.Date, activity.start_time)} - {formatTime(day.Date, activity.end_time)}
                                      </p>
                                      {activity.location && (
                                        <p className="mb-0 text-secondary activity-location">
                                          <i className="bi bi-geo-alt-fill me-1"></i>
                                          {activity.location}
                                        </p>
                                      )}
                                      {activity.cost && (
                                        <p className="mb-0 text-info activity-cost">
                                          Cost: ${activity.cost}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Section 3: Notes (optional, displays on a new line) */}
                                  {activity.notes && (
                                    <small className="text-break mt-2 d-block activity-notes">
                                      **Notes:** {activity.notes}
                                    </small>
                                  )}
                                </li>
                              ))}
                            </ul>
                            ) : (
                            <p>No activities planned for this day.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )} 
              {!itineraryLoading && itinerary && itinerary.length === 0 && (
                <div>
                <p>No itinerary available for this trip.</p>
                <p>create Itinerary</p>
                <ItineraryCreate trip_id= {trip.id}/>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TripCard;
