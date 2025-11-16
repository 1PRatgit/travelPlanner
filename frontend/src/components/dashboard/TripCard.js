import React, { useState, useEffect } from "react";
import { useTripLoader } from "../../hooks/useTripLoader";
import { useItineraryLoader } from "../../hooks/useItineraryLoader";
import { formatTime, formatDate } from "../../utils/utils";
import { ItineraryCreate } from "../tripForm/ItineraryCreate";
import { useUpdateActivity } from "../../hooks/useActivityUpdate";
import { ItineraryEdit } from "../tripForm/ItineraryEdit";
import { ActivityCard } from "./ActivityCard";
import ActivityEdit from "../tripForm/ActivityEdit";
import { ActivityCreate } from "../tripForm/ActivityCreate";

function TripCard({ trip_id }) {
  const { trip, loading, error, loadTrip } = useTripLoader(trip_id);

  const [showItineraryViewer, setShowItineraryViewer] = useState(false);
  const [showItineraryForm, setShowItineraryForm] = useState(false);
  const [showActivityCreate, setShowActivityCreate] = useState(false);
  const [activeDay, setActiveDay] = useState(null);

  const { updateActivity, loading: updatingActivity } = useUpdateActivity();
  // const { updateItinerary, loading: updatingItinerary} = useUpdateItinerary();

  const [editingActivity, setEditingActivity] = useState(null);
  const [localItinerary, setLocalItinerary] = useState([]);

  const {
    itinerary,
    itineraryLoading,
    error: itineraryError,
  } = useItineraryLoader(trip?.id);

  // **Hook must run before any early return**
  useEffect(() => {
    setLocalItinerary(itinerary ?? []);
  }, [itinerary]);

  if (loading) return <div>Loading trip...</div>;
  if (error) return <div>Error loading trip.</div>;

  const toggleItineraryViewer = () => {
    if (!showItineraryViewer) setShowItineraryForm(false);
    setShowItineraryViewer((prev) => !prev);
  };
  const toggleItineraryForm = () => {
    // When showing the form, hide the viewer
    if (!showItineraryForm) setShowItineraryViewer(false);
    setShowItineraryForm((prev) => !prev);
  };
  const itineraryExists =
    !itineraryLoading && itinerary && itinerary.length > 0;

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

  // **Hook must run before any early return**
  // useEffect(() => {
  //   setLocalItinerary(itinerary ?? []);
  // }, [itinerary]);

  // async function submitEditActivity(payload) {
  //   if (editingActivity?.id) {
  //     console.error("Missing activity id");
  //     return;
  //   }
  //   try {
  //     await updateActivity(editingActivity.id, payload);
  //     await loadTrip();
  //     setEditingActivity(null);
  //   } catch (e) {
  //     console.error("Failed to update activity", e);
  //   }
  // }

  // async function submitEditItinerary(payload) {
  //   if (!editingItinerary?.id) {
  //     console.error("Missing Itinerary id");
  //     return;
  //   }
  //   try {
  //     // call the update function from your hook
  //     await updateItinerary(editingItinerary.id, payload);
  //     await loadTrip();
  //     setEditingItinerary(null);
  //   } catch (e) {
  //     console.error("Failed to update Itinerary", e);
  //   }
  // }

  const accordionId = `accordion-${trip.id}`;

  return (
    // <>
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
        {showItineraryForm && trip && (
          <div className="mt-3">
            <h6 className="fw-bold mt-2">
              {itineraryExists ? "Edit Itinerary" : "Create Itinerary"} for{" "}
              {trip.title}
            </h6>
            {console.log(trip.id)}
            <ItineraryCreate
              trip_id={trip.id}
              // onItineraryCreated={itineraryExists ? itinerary : null}
              // Optional: Pass a callback to close the form and/or reload data on success
              onSuccess={() => {
                loadTrip(); // Reload trip data if necessary
                setShowItineraryForm(false); // Close the form
                setShowItineraryViewer(true); // Optionally show the viewer
              }}
            />
          </div>
        )}

        {/* Itinerary viewer */}
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pencil-square"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path
                    fillRule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                  />
                </svg>
              </button>
            </div>
            {itineraryLoading && <p>Loading Itinerary...</p>}
            {itineraryError && (
              <p className="text-danger">Error loading itinerary.</p>
            )}
            {!itineraryLoading && itinerary && itinerary.length > 0 && (
              <div className="accordion" id={accordionId}>
                {localItinerary.map((day, index) => {
                  const activityId = day.id ?? null;
                  const collapseId = `collapse-${trip.id}-${index}`; // Unique ID for collapse
                  const headingId = `heading-${trip.id}-${index}`; // Unique ID for heading
                  const activitiesCount = day.activities_in_day?.length ?? 0;
                  
                  return (
                    <div className="accordion-item" key={activityId}>
                      {/* <div className="accordion-item" key={index}> */}
                      {/* {console.log(activityId)} */}
                      <h2 className="accordion-header" id={headingId}>
                        <div className="d-flex justify-content-between align-items-center w-100">
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
                          {/* <div className="ms-2">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                // onClick={() => setEditingItinerary(day)}
                                title="Edit Day"
                                onClick={(e) => {
                                e.stopPropagation();            // IMPORTANT: prevent parent accordion from handling this click
                                console.log("Edit Day clicked for day:", day);
                                setEditingItinerary(day);
                              }}
                              >
                                Edit Itinerary
                              </button>
                            </div> */}
                        </div>
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
                          {/* {console.log(activityId)}
                           {console.log(day.activities_in_day )} */}
                          {/* inside the accordion-body where you have day.activities_in_day */}
                          {day.activities_in_day && day.activities_in_day.length > 0 ? (
                            <ul className="list-group">
                              {day.activities_in_day.map((activity, aIndex) => {
                                // {console.log(activityId)}
                                const localKey = `${activityId}-${aIndex}`;
                                const isEditingThis =
                                  editingActivity === localKey;

                                return (
                                  <React.Fragment key={localKey}>
                                    {console.log(
                                      "🟣 Rendering ActivityEdit with activity_id:",
                                      localKey,
                                      "and activity:",
                                      activity
                                    )}

                                    {isEditingThis ? (
                                      <ActivityEdit
                                        activity_id={activity.id}
                                        activity={activity}
                                        dayDate={day.Date}
                                        formatTime={formatTime}
                                        onUpdate={(updatedActivity) => {
                                          // updatedActivity is the object returned by the API after PATCH
                                          setLocalItinerary((prev) =>
                                            prev.map((d) => {
                                              if (d.id !== day.id) return d;
                                              return {
                                                ...d,
                                                activities_in_day:
                                                  d.activities_in_day.map(
                                                    (act) =>
                                                      // prefer matching by activity id if present, otherwise fallback to index
                                                      act.id &&
                                                      updatedActivity.id
                                                        ? act.id ===
                                                          updatedActivity.id
                                                          ? {
                                                              ...act,
                                                              ...updatedActivity,
                                                            }
                                                          : act
                                                        : act
                                                  ),
                                              };
                                            })
                                          );
                                          setEditingActivity(null);
                                        }}
                                      />
                                    ) : (
                                      <ActivityCard
                                        activity={activity}
                                        dayDate={day.Date}
                                        formatTime={formatTime}
                                        onEdit={() => setEditingActivity(localKey)}
                                        onDelete={(deletedActivityId) => {
                                          // remove the activity from localItinerary for this day
                                          setLocalItinerary((prev) =>
                                            prev.map((d) =>
                                              d.id !== day.id
                                                ? d
                                                : {
                                                    ...d,
                                                    activities_in_day:
                                                      d.activities_in_day.filter(
                                                        (act) => act.id !== deletedActivityId
                                                      ),
                                                  }
                                            )
                                          );
                                        }}
                                      />
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </ul>
                          ) : (
                            <div>
                              <p>No activities planned for this day.</p>
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => {
                                  // show the create form so user can add activities
                                  setActiveDay(day.id);
                                  setShowActivityCreate(true);
                                }}
                              >
                                + Add Activity
                              </button>
                            </div>
                          )}
                          {console.log("Active Day:", day.id)}

                          {/* Activity Create Form - show only for active day */}
                          {showActivityCreate && activeDay === day.id && (
                            <ActivityCreate
                              activity_date={day.Date}
                              itinerary_id = {day.id}
                              transport_id={day.transport_id || 0}
                              onActivityCreated={(newActivity) => {
                                // Add new activity to the day
                                setLocalItinerary((prev) =>
                                  prev.map((d) =>
                                    d.id === day.id
                                      ? {
                                          ...d,
                                          activities_in_day: [
                                            ...d.activities_in_day,
                                            newActivity,
                                          ],
                                        }
                                      : d
                                  )
                                );
                                setShowActivityCreate(false);
                                setActiveDay(null);
                              }}
                              onCancel={() => {
                                setShowActivityCreate(false);
                                setActiveDay(null);
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
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
