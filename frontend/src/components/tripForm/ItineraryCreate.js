import { useItineraryCreate } from "../../hooks/useItineraryCreate";

const TRANSPORT_OPTIONS = [
  { id: 0, label: "None" },
  { id: 1, label: "✈️ Flight" },
  { id: 2, label: "🚗 Road" },
  { id: 3, label: "🚂 Train" },
];

export function ItineraryCreate({ onItineraryCreated, onSuccess, trip_id }) {
  const { 
    formData, 
    loading, 
    message,
    handleMainChange, 
    handleAddActivity, 
    handleActivityChange, 
    handleRemoveActivity, 
    createNewItinerary 
  } = useItineraryCreate({ onItineraryCreated: onSuccess ?? onItineraryCreated, trip_id });

  const handleSubmit = (e) => {
    e.preventDefault();
    createNewItinerary();
  };

  return (
    <div className="card shadow-sm border-0" style={{ borderRadius: "10px" }}>
      <div
        className="card-header text-center"
        style={{
          backgroundColor: "#fff",
          borderBottom: "2px solid #ffd6e8",
        }}
      >
        <h5 className="fw-bold mb-0" style={{ color: "#c2185b" }}>
          📅 Create Itinerary Day
        </h5>
      </div>

      <div className="card-body px-4 py-4">
        <form onSubmit={handleSubmit}>
          {/* Main Itinerary Day Details */}
          <h6 className="fw-bold mb-3" style={{ color: "#c2185b" }}>Day Details</h6>
          <div className="row mb-4 text-start">
            {/* Day Number */}
            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">Day Number</label>
              <input
                type="number"
                className="form-control"
                name="day_number"
                value={formData.day_number}
                onChange={handleMainChange}
                required
                min="1"
              />
            </div>
            {/* Date */}
            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">Date</label>
              <input
                type="date"
                className="form-control"
                name="Date"
                value={formData.Date}
                onChange={handleMainChange}
                required
              />
            </div>
            {/* Transportation Dropdown */}
            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">Transportation</label>
              <select
                className="form-control"
                name="transport_id"
                value={formData.transport_id}
                onChange={handleMainChange}
              >
                {TRANSPORT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <hr style={{ borderTop: "2px dashed #ffd6e8" }} />

          {/* Activities in Day (Dynamic Section) */}
          <h6 className="fw-bold mb-3 mt-4" style={{ color: "#c2185b" }}>Activities <span className="text-muted fw-normal">({formData.activities_in_day.length})</span></h6>

          {formData.activities_in_day.map((activity, index) => (
            <div key={index} className="p-3 mb-3 border" style={{ borderRadius: "8px", backgroundColor: "#fff5fa" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 fw-bold" style={{ color: "#7a002a" }}>Activity #{index + 1}</h6>
                {formData.activities_in_day.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{ backgroundColor: "#ffb6c1", color: "#333", fontSize: "0.8rem" }}
                    onClick={() => handleRemoveActivity(index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Title and Category */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label form-label-sm">Title</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="title"
                    placeholder="e.g., Visit Eiffel Tower"
                    value={activity.title}
                    onChange={(e) => handleActivityChange(index, e)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label form-label-sm">Category</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="category"
                    placeholder="e.g., Sightseeing, Food, Shopping"
                    value={activity.category}
                    onChange={(e) => handleActivityChange(index, e)}
                  />
                </div>
              </div>

              {/* Time and Location */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label form-label-sm">Start Time</label>
                  <input
                    type="time"
                    className="form-control form-control-sm"
                    name="start_time"
                    value={activity.start_time}
                    onChange={(e) => handleActivityChange(index, e)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label form-label-sm">End Time</label>
                  <input
                    type="time"
                    className="form-control form-control-sm"
                    name="end_time"
                    value={activity.end_time}
                    onChange={(e) => handleActivityChange(index, e)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label form-label-sm">Cost ($)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    name="cost"
                    placeholder="0"
                    value={activity.cost}
                    onChange={(e) => handleActivityChange(index, e)}
                    min="0"
                  />
                </div>
              </div>

              {/* Location and Notes */}
              <div className="mb-3">
                <label className="form-label form-label-sm">Location</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="location"
                  placeholder="Street Address or Landmark"
                  value={activity.location}
                  onChange={(e) => handleActivityChange(index, e)}
                />
              </div>

              <div className="mb-2">
                <label className="form-label form-label-sm">Notes</label>
                <textarea
                  className="form-control form-control-sm"
                  name="notes"
                  placeholder="Any details about this activity..."
                  rows="2"
                  value={activity.notes}
                  onChange={(e) => handleActivityChange(index, e)}
                />
              </div>
            </div>
          ))}

          {/* Add Activity Button */}
          <div className="text-center mb-4">
            <button
              type="button"
              className="btn btn-sm fw-semibold"
              style={{
                backgroundColor: "#fff0f5",
                border: "1px dashed #ffb6c1",
                color: "#c2185b",
                padding: "5px 15px",
              }}
              onClick={handleAddActivity}
            >
              + Add Another Activity
            </button>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-4">
            <button
              type="submit"
              className="btn fw-semibold"
              disabled={loading}
              style={{
                backgroundColor: "#ffd6e8",
                border: "1px solid #ffb6c1",
                color: "#333",
                padding: "10px 20px",
              }}
            >
              {loading ? "Saving Itinerary..." : "Save Itinerary Day"}
            </button>
          </div>

          {/* Feedback message */}
          {message && (
            <div
              className={`alert mt-3 text-center ${
                message.type === "success"
                  ? "alert-success"
                  : "alert-danger"
              }`}
            >
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}