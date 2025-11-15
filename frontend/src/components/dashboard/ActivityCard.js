// ActivityCard.jsx
import React from "react";

export function ActivityCard({ activity, dayDate, onEdit, formatTime }) {
  const start = activity?.start_time;
  const end = activity?.end_time;

  const safeText = (value, label) => {
    if (!value || value === "string" || value === "undefined" || value === "null") {
      return <span className="text-muted">No {label} available</span>;
    }
    return value;
  };

  const timeText =
    start && end
      ? `${formatTime(dayDate, start)} - ${formatTime(dayDate, end)}`
      : start
      ? `${formatTime(dayDate, start)}`
      : end
      ? `${formatTime(dayDate, end)}`
      : null;

  return (
    <li className="list-group-item p-3 mb-2">
      <div className="card border-0 shadow-sm">
        <div className="row g-0 align-items-center">
          <div className="col-auto d-none d-md-block">
            <div
              style={{
                width: 6,
                height: "100%",
                background: activity?.category_color || "#f8c6d1",
                borderTopLeftRadius: ".5rem",
                borderBottomLeftRadius: ".5rem",
              }}
            />
          </div>
          {console.log(activity)}

          <div className="col">
            <div className="card-body py-2 px-3">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
                <div className="mb-2 mb-md-0 pe-md-3" style={{ minWidth: 0 }}>
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0 text-truncate" title={activity?.title || ""}>
                      {activity?.title || <span className="text-muted">No title available</span>}
                    </h5>

                    <span
                      className={`ms-2 badge ${activity?.is_completed ? "bg-success" : "bg-warning text-dark"}`}
                      aria-label={activity?.is_completed ? "Completed" : "Pending"}
                    >
                      {activity?.is_completed ? "Completed" : "Pending"}
                    </span>
                  </div>

                  <div className="mt-1">
                    {activity?.category ? (
                      <small className="text-secondary">
                        <i className="bi bi-tag-fill me-1" />
                        {safeText(activity.category, "category")}
                      </small>
                    ) : (
                      <small className="text-muted">No category available</small>
                    )}
                  </div>
                </div>

                <div className="text-md-end" style={{ minWidth: 210 }}>
                  <div>
                    {timeText ? (
                      <p className="mb-1 fw-bold text-primary">{timeText}</p>
                    ) : (
                      <p className="mb-1 text-muted">No time available</p>
                    )}
                  </div>

                  <div>
                    {activity?.location ? (
                      <small className="d-block text-secondary">
                        <i className="bi bi-geo-alt-fill me-1" />
                        {safeText(activity.location, "location")}
                      </small>
                    ) : (
                      <small className="d-block text-muted">No location available</small>
                    )}
                  </div>

                  <div>
                    {activity?.cost ? (
                      <small className="d-block text-info">Cost: {safeText(`$${activity.cost}`, "cost")}</small>
                    ) : (
                      <small className="d-block text-muted">No cost available</small>
                    )}
                  </div>

                  <div className="mt-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit && onEdit(activity);
                      }}
                      aria-label={`Edit activity ${activity?.title || ""}`}
                    >
                      Edit Activity
                    </button>
                  </div>
                </div>
              </div>

              <hr className="my-2" />

              <div>
                {activity?.notes ? (
                  <small className="text-muted d-block">{safeText(activity.notes, "notes")}</small>
                ) : (
                  <small className="text-muted">No notes available</small>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
