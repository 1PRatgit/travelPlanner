import { useState } from "react";
import api from "../../api/axiosInstance";

export function ActivityCreate({activity_date, itinerary_id,transport_id, onActivityCreated, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    start_time: "",
    end_time: "",
    location: "",
    notes: "",
    cost: 0,
    is_completed: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cost" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        ...formData,
        activity_date: activity_date,
        itinerary_id: itinerary_id,
        // day_id: day_id,
        // transport_id: transport_id || 0,
      };

      const response = await api.post(`/activities/`, payload);
      setMessage({
        type: "success",
        text: "Activity created successfully!",
      });

      // Reset form
      setFormData({
        title: "",
        category: "",
        start_time: "",
        end_time: "",
        location: "",
        notes: "",
        cost: 0,
        is_completed: false,
      });

      // Notify parent
      setTimeout(() => {
        if (onActivityCreated) {
          onActivityCreated(response.data);
        }
      }, 1000);
    } catch (err) {
      console.error("Error creating activity:", err);
      setMessage({
        type: "error",
        text: "Failed to create activity. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 mt-3" style={{ borderRadius: "10px" }}>
      <div
        className="card-header text-center"
        style={{
          backgroundColor: "#fff",
          borderBottom: "2px solid #ffd6e8",
        }}
      >
        <h6 className="fw-bold mb-0" style={{ color: "#c2185b" }}>
          ➕ Add Activity for This Day
        </h6>
      </div>

      <div className="card-body px-4 py-4">
        <form onSubmit={handleSubmit}>
          {/* Title and Category */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Title *</label>
              <input
                type="text"
                className="form-control"
                name="title"
                placeholder="e.g., Visit Eiffel Tower"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Category</label>
              <input
                type="text"
                className="form-control"
                name="category"
                placeholder="e.g., Sightseeing, Food, Shopping"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Time and Cost */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Start Time</label>
              <input
                type="time"
                className="form-control"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">End Time</label>
              <input
                type="time"
                className="form-control"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Cost ($)</label>
              <input
                type="number"
                className="form-control"
                name="cost"
                placeholder="0"
                value={formData.cost}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Location and Notes */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Location</label>
            <input
              type="text"
              className="form-control"
              name="location"
              placeholder="Street Address or Landmark"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Notes</label>
            <textarea
              className="form-control"
              name="notes"
              placeholder="Any details about this activity..."
              rows="2"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          {/* Buttons */}
          <div className="d-flex gap-2 justify-content-center mt-4">
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
              {loading ? "Creating..." : "Create Activity"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary fw-semibold"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>

          {/* Feedback message */}
          {message && (
            <div
              className={`alert mt-3 text-center ${
                message.type === "success" ? "alert-success" : "alert-danger"
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