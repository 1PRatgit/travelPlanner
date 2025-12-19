import React, { useState, useEffect } from "react";
import { useTripLoader } from "../../hooks/useTripLoader";
import { useItineraryLoader } from "../../hooks/useItineraryLoader";
import { formatTime, formatDate } from "../../utils/utils";
import { ItineraryCreate } from "../tripForm/ItineraryCreate";
import { useUpdateActivity } from "../../hooks/useActivityUpdate";
import { ActivityCard } from "./ActivityCard";
import ActivityEdit from "../tripForm/ActivityEdit";
import { ActivityCreate } from "../tripForm/ActivityCreate";
import TripHeader from "../trips/TripHeader";
import "../../assets/TripCard.css";

function TripCard({ trip_id }) {
  const { trip, loading, error, loadTrip } = useTripLoader(trip_id);
  const [isAdding, setIsAdding] = useState(false);

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

  const accordionId = `accordion-${trip.id}`;

  return (
    // <>
    <div className="card shadow-sm mb-3" style={{ borderColor: "#ffd6e8" }}>
      <div className="card-body">
        <TripHeader trip={trip} />
        <button
          className="btn btn-rose mt-3"
          onClick={buttonAction}
          disabled={buttonDisabled}
        >
          {buttonText}
        </button>
        <div className="">
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
            <>
              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="fw-bold"> Trip Itinerary</h6>
                  <button className="add-day-btn" onClick={toggleItineraryForm}>
                    + add day
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
                              {day.activities_in_day &&
                              day.activities_in_day.length > 0 ? (
                                <ul className="list-group">
                                  {day.activities_in_day.map(
                                    (activity, aIndex) => {
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
                                                    if (d.id !== day.id)
                                                      return d;
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
                                              onEdit={() =>
                                                setEditingActivity(localKey)
                                              }
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
                                                              (act) =>
                                                                act.id !==
                                                                deletedActivityId
                                                            ),
                                                        }
                                                  )
                                                );
                                              }}
                                            />
                                          )}
                                        </React.Fragment>
                                      );
                                    }
                                  )}
                                </ul>
                              ) : (
                                <div>
                                  <p>No activities planned for this day.</p>
                                </div>
                              )}
                              <button
                                className="add-day-btn"
                                onClick={() => {
                                  // show the create form so user can add activities
                                  setActiveDay(day.id);
                                  setShowActivityCreate(true);
                                }}
                              >
                                + Add Activity
                              </button>
                              {console.log("Active Day:", day.id)}

                              {/* Activity Create Form - show only for active day */}
                              {showActivityCreate && activeDay === day.id && (
                                <ActivityCreate
                                  activity_date={day.Date}
                                  itinerary_id={day.id}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TripCard;
