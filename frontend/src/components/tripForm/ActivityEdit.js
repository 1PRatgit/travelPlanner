// ActivityCardEditable.jsx
import React, { useState, useEffect } from "react";
import { useUpdateActivity } from "../../hooks/useUpdateActivity";

/**
 * Props:
 * - activity: the activity object
 * - dayDate: date string used by formatTime (if you use formatTime for display)
 * - formatTime: (date, time) => formatted time (optional, for display)
 * - onUpdate: callback(updatedActivity) -> parent should update its list/state
 */
export default function ActivityEdit({ activity_id, activity, dayDate, formatTime, onUpdate }) {
    
  const { updateActivity, loading, error: hookError } = useUpdateActivity();
console.log(activity_id)
  // --- Helper to normalize placeholders ---
  const isPlaceholder = (v) =>
    v === undefined || v === null || v === "" || v === "string" || v === "null" || v === "undefined";

  const sanitizeInitial = (v) => (isPlaceholder(v) ? "" : v);
  
  const [form, setForm] = useState(() => ({
    title: sanitizeInitial(activity.title),
    category: sanitizeInitial(activity.category),
    location: sanitizeInitial(activity.location),
    cost: sanitizeInitial(activity.cost),
    start_time: sanitizeInitial(activity.start_time),
    end_time: sanitizeInitial(activity.end_time),
    notes: sanitizeInitial(activity.notes),
    is_completed: !!activity.is_completed,
  }));

  // --- Editing state (start in editing mode immediately) ---
  const [isEditing, setIsEditing] = useState(true);
  const [localError, setLocalError] = useState(null);

  // When activity prop changes (parent update), reset form if not editing
   useEffect(() => {
    if (!isEditing && activity) {
      setForm({
        title: sanitizeInitial(activity.title),
        category: sanitizeInitial(activity.category),
        location: sanitizeInitial(activity.location),
        cost: sanitizeInitial(activity.cost),
        start_time: sanitizeInitial(activity.start_time),
        end_time: sanitizeInitial(activity.end_time),
        notes: sanitizeInitial(activity.notes),
        is_completed: !!activity.is_completed,
      });
    }
  }, [activity]);

  // Construct display time (if formatTime provided)
  const displayTime = () => {
    const s = activity.start_time;
    const e = activity.end_time;
    if (formatTime) {
      if (s && e) return `${formatTime(dayDate, s)} - ${formatTime(dayDate, e)}`;
      if (s) return formatTime(dayDate, s);
      if (e) return formatTime(dayDate, e);
      return null;
    }
    // fallback: raw values or "No time"
    if (s || e) return `${s || ""}${s && e ? " - " : ""}${e || ""}`;
    return null;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

// handle saving functionality

 async function handleSave() {
  setLocalError(null);

  if (!form.title.trim()) {
    setLocalError("Title is required.");
    return;
  }

  // derive correct activity ID automatically
 

  if (!activity_id) {
    console.error("❌ Missing activity ID for edit:", activity);
    setLocalError("Cannot update: activity ID is missing.");
    return;
  }

  // only send non-empty fields
  const payload = Object.fromEntries(
    Object.entries({
      title: form.title.trim(),
      category: form.category.trim() || null,
      location: form.location.trim() || null,
      cost: form.cost !== "" ? Number(form.cost) : null,
      start_time: form.start_time || null,
      end_time: form.end_time || null,
      notes: form.notes.trim() || null,
      is_completed: !!form.is_completed,
    }).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
  );

  console.log("🔄 Saving activity", activity_id, payload);

  try {
    const updated = await updateActivity(activity_id, payload);
    if (onUpdate) onUpdate(updated);
    setIsEditing(false);
  } catch (err) {
    console.error("❌ Failed to save activity", err);
    setLocalError(
      err?.response?.data?.detail ||
        (typeof err === "string"
          ? err
          : "Failed to update activity. Please try again.")
    );
  }
}



  const handleCancel = () => {
    // 🔥 Restore previous values, not empty strings
    setForm({
      title: sanitizeInitial(activity.title),
      category: sanitizeInitial(activity.category),
      location: sanitizeInitial(activity.location),
      cost: sanitizeInitial(activity.cost),
      start_time: sanitizeInitial(activity.start_time),
      end_time: sanitizeInitial(activity.end_time),
      notes: sanitizeInitial(activity.notes),
      is_completed: !!activity.is_completed,
    });
    setIsEditing(false); // just exit edit mode, keep data
    setLocalError(null);
  };

  // small helper for display fallback
  const displayOrPlaceholder = (value, label) =>
    !isPlaceholder(value) ? value : <span className="text-muted">No {label} available</span>;

  return (
    <li className="list-group-item p-3 mb-2">
      <div className="card border-0 shadow-sm">
        <div className="card-body py-3 px-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
            {/* Left: Title + category */}
            <div className="mb-3 mb-md-0 pe-md-3" style={{ minWidth: 0 }}>
              <div className="d-flex align-items-center">
                {isEditing ? (
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="form-control form-control-sm me-2"
                    style={{ minWidth: 220 }}
                    placeholder="Activity title"
                    aria-label="Activity title"
                  />
                ) : (
                  <h5 className="mb-0 text-truncate" title={activity.title || ""}>
                    {displayOrPlaceholder(activity.title, "title")}
                  </h5>
                )}

                {!isEditing && (
                  <span
                    className={`ms-2 badge ${activity.is_completed ? "bg-success" : "bg-warning text-dark"}`}
                    aria-label={activity.is_completed ? "Completed" : "Pending"}
                    style={{ fontSize: "0.85em" }}
                  >
                    {activity.is_completed ? "Completed" : "Pending"}
                  </span>
                )}
              </div>

              <div className="mt-2">
                {isEditing ? (
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="form-control form-control-sm"
                    placeholder="Category"
                    aria-label="Category"
                  />
                ) : (
                  <small className="text-secondary">
                    <i className="bi bi-tag-fill me-1" />
                    {displayOrPlaceholder(activity.category, "category")}
                  </small>
                )}
              </div>
            </div>

            {/* Right: time, location, cost, edit/save */}
            <div className="text-md-end" style={{ minWidth: 210 }}>
              {/* Time */}
              <div>
                {isEditing ? (
                  <div className="d-flex gap-2 justify-content-end">
                    {/* Two simple text inputs for start/end times. You may change to 'time' type if values fit. */}
                    <input
                      name="start_time"
                      value={form.start_time}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="Start time (eg 05:30)"
                      style={{ width: 110 }}
                      aria-label="Start time"
                    />
                    <input
                      name="end_time"
                      value={form.end_time}
                      onChange={handleChange}
                      className="form-control form-control-sm"
                      placeholder="End time (eg 06:30)"
                      style={{ width: 110 }}
                      aria-label="End time"
                    />
                  </div>
                ) : (
                  <p className="mb-1 fw-bold text-primary">{displayTime() || <span className="text-muted">No time available</span>}</p>
                )}
              </div>

              {/* Location */}
              <div>
                {isEditing ? (
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="form-control form-control-sm mt-1"
                    placeholder="Location"
                    aria-label="Location"
                  />
                ) : (
                  <small className="d-block text-secondary">
                    <i className="bi bi-geo-alt-fill me-1" />
                    {displayOrPlaceholder(activity.location, "location")}
                  </small>
                )}
              </div>

              {/* Cost */}
              <div>
                {isEditing ? (
                  <input
                    name="cost"
                    type="number"
                    value={form.cost}
                    onChange={handleChange}
                    className="form-control form-control-sm mt-1"
                    placeholder="Cost"
                    aria-label="Cost"
                  />
                ) : (
                  <small className={activity.cost ? "d-block text-info" : "text-muted d-block"}>
                    {activity.cost ? `Cost: $${activity.cost}` : "No cost available"}
                  </small>
                )}
              </div>

              {/* Edit / Save / Cancel */}
              <div className="mt-2 d-flex justify-content-end gap-2">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={handleSave}
                      disabled={loading}
                      aria-label="Save activity"
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleCancel} disabled={loading}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setIsEditing(true)}>
                    Edit Activity
                  </button>
                )}
              </div>
            </div>
          </div>

          <hr className="my-2" />

          {/* Notes and completion toggle */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
            <div style={{ flex: 1 }}>
              {isEditing ? (
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="form-control form-control-sm"
                  rows={2}
                  placeholder="Notes"
                  aria-label="Notes"
                />
              ) : (
                <small className="text-muted d-block">{displayOrPlaceholder(activity.notes, "notes")}</small>
              )}
            </div>

            {/* Optional: toggle completion while editing */}
            <div className="mt-2 mt-md-0 ms-md-3 text-md-end">
              {isEditing ? (
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`completedSwitch-${activity.id}`}
                    name="is_completed"
                    checked={!!form.is_completed}
                    onChange={handleChange}
                  />
                  <label className="form-check-label small" htmlFor={`completedSwitch-${activity.id}`}>
                    Mark completed
                  </label>
                </div>
              ) : (
                <small className="text-muted">{activity.is_completed ? "Completed" : "Not completed"}</small>
              )}
            </div>
          </div>

          {/* Errors */}
          {/* Errors */}
            <div className="mt-2 text-danger small">
            {localError && <div>{localError}</div>}
            {!localError && hookError && <div className="text-danger small">{JSON.stringify(hookError)}</div>}

            </div>

        </div>
      </div>
    </li>
  );
}
