import { useTripCreate } from "../../hooks/useTripCreate";

export default function TripCreate({ onTripCreated }) {
  const { formData, setFormData, loading, message, createNewTrip } =
    useTripCreate({ onTripCreated });
  
  // ✅ Define submit handler separately
  const handleSubmit = (e) => {
    e.preventDefault();
    createNewTrip();
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
          🌸 Create a New Trip
        </h5>
      </div>

      <div className="card-body px-4 py-4">
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter trip title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          {/* Category */}
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Category</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Adventure, Relaxation, Family"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
          </div>

          {/* Destination */}
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Destination</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter destination"
              value={formData.destination}
              onChange={(e) =>
                setFormData({ ...formData, destination: e.target.value })
              }
            />
          </div>

          {/* Dates */}
          <div className="row mb-3 text-start">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">End Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
              />
            </div>
          </div>

          {/* Budget */}
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">
              Estimated Budget ($)
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter estimated budget"
              value={formData.estimated_budget}
              onChange={(e) =>
                setFormData({ ...formData, estimated_budget: e.target.value })
              }
            />
          </div>

          {/* Notes */}
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Notes</label>
            <textarea
              className="form-control"
              placeholder="Add any notes or preferences..."
              rows="3"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
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
              {loading ? "Creating..." : "Create Trip"}
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

