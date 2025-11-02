import { useState } from "react";
import { useTripLoader } from "../../hooks/useTripLoader";
import { useItineraryLoader } from "../../hooks/useItineraryLoader";
import {formatTime,formatDate} from "../../utils/utils"
import { ItineraryCreate } from "../tripForm/ItineraryCreate";

function TripCard({ trip_id }) {
  const { trip, loading, error, loadTrip } = useTripLoader(trip_id);
  const [showItineraryViewer, setShowItineraryViewer] = useState(false);
  const [showItineraryForm, setShowItineraryForm] = useState(false);

  const {
  itinerary,
  itineraryLoading,
  error: itineraryError, 
 } = useItineraryLoader(trip?.id);

  
  if (loading) return <div>Loading trip...</div>;
  if (error) return <div>Error loading trip.</div>;
  const toggleItineraryViewer = () => {
    // When showing the viewer, hide the form
    if (!showItineraryViewer) setShowItineraryForm(false);
    setShowItineraryViewer((prev) => !prev);
  };
  const toggleItineraryForm = () => {
    // When showing the form, hide the viewer
    if (!showItineraryForm) setShowItineraryViewer(false);
    setShowItineraryForm((prev) => !prev);
  };
  const itineraryExists = !itineraryLoading && itinerary && itinerary.length > 0;
 
  let buttonText;
  let buttonAction;
  let buttonDisabled = !trip; // Default disable state

  if (itineraryLoading) {
  buttonText = "Loading Itinerary...";
  buttonAction = () => {};
  buttonDisabled = true;
  } else if (showItineraryForm) {
  // If form is open, button should close it
  buttonText = "Close Form";
  buttonAction = toggleItineraryForm;
  } else if (itineraryExists) {
  // Itinerary exists, so button toggles the viewer
  if (showItineraryViewer) {
    buttonText = "Hide Itinerary";
    buttonAction = toggleItineraryViewer;
  } else {
    buttonText = "Show Itinerary";
    buttonAction = toggleItineraryViewer;
  }
  } else {
  // No itinerary exists — allow creating one
  buttonText = "Create Itinerary";
  buttonAction = toggleItineraryForm;
  }


  const accordionId = `accordion-${trip.id}`;

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
            onClick={buttonAction}
            disabled={buttonDisabled}
          >
            {buttonText}
          </button>

          {/* 2. Create/Edit Itinerary Button */}
          </div>
          {/* Conditional Rendering for Itinerary Form (Create/Edit) */}
          {showItineraryForm && trip &&(
            <div className="mt-3">
              <h6 className="fw-bold mt-2">{itineraryExists ? "Edit Itinerary" : "Create Itinerary"} for {trip.title}</h6>
              {console.log(trip.id)}
              <ItineraryCreate 
                trip_id={trip.id} 
                existingItinerary={itineraryExists ? itinerary : null} 
                // Optional: Pass a callback to close the form and/or reload data on success
                onSuccess={() => {
                  loadTrip(); // Reload trip data if necessary
                  setShowItineraryForm(false); // Close the form
                  setShowItineraryViewer(true); // Optionally show the viewer
                }}
              />
            </div>
          )}


          {console.log(itinerary)}
          {showItineraryViewer && itineraryExists && (
            <div className="mt-3">
              <div className="d-flex justify-content-between align-items-center">
                  <h6 className="fw-bold"> Trip Itinerary</h6>
                  <button 
                      className="btn btn-sm btn-outline-secondary border-0" 
                      onClick={toggleItineraryForm} 
                      title="Edit Itinerary"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                      </svg>
                  </button>
              </div>
              {itineraryLoading && <p>Loading Itinerary...</p>}
              {itineraryError && (
                <p className="text-danger">Error loading itinerary.</p>
              )}
              {!itineraryLoading && itinerary && itinerary.length > 0 && (
                <div className="accordion" id={accordionId}>
                  {itinerary.map((day, index) => {
                    const collapseId = `collapse-${trip.id}-${index}`; // Unique ID for collapse
                    const headingId = `heading-${trip.id}-${index}`; // Unique ID for heading
                    return(
                    <div className="accordion-item" key={index}>
                      <h2 className="accordion-header" id={headingId}>
                        <button
                          className={`accordion-button ${
                            index > 0 ? "collapsed" : ""
                          }`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#${collapseId}`}
                          aria-expanded={index === 0 ? "true" : "false"}
                          aria-controls={collapseId}
                        >
                          Day {index + 1} - {day.date}
                        </button>
                      </h2>
                      <div
                        id={collapseId}
                        className={`accordion-collapse collapse ${
                          index === 0 ? "show" : ""
                        }`}
                        aria-labelledby={headingId}
                        data-bs-parent={`#${accordionId}`}
                      >
                        <div className="accordion-body">

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
                    )
                })}
                </div>
              )} 
            </div>
          )}
        </div>
      </div>
  );
}

export default TripCard;
