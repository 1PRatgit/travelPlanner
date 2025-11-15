// ItineraryDayEditModal.jsx
import React, { useState, useEffect } from "react";

export function ItineraryEdit({ itinerary, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    day_number: 1,
    Date: "",         // ISO date string like "2025-11-08"
    transport_id: 0,
  });

  useEffect(() => {
    if (itinerary) {
      setForm({
        day_number: itinerary.day_number ?? 1,
        // Map your backend field name; some payloads use `Date` or `date`
        Date: itinerary.Date ?? itinerary.date ?? "",
        transport_id: itinerary.transport_id ?? 0,
      });
    }
  }, [itinerary]);

  // nothing to render if no itinerary selected
  if (!itinerary) return null;

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
          📅 Edit Itinerary
        </h5>
      </div>
      <div className="modal-dialog">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // prepare payload: remove unchanged fields if you want partial update
            onSubmit(form);
          }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit itinerary {form.day_number}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">itinerary Number</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={form.day_number}
                  onChange={(e) => setForm({ ...form, day_number: Number(e.target.value) })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.Date}
                  onChange={(e) => setForm({ ...form, Date: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Transport ID</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.transport_id}
                  onChange={(e) => setForm({ ...form, transport_id: Number(e.target.value) })}
                />
                <small className="text-muted">Use the transport id or replace this with a select input listing transports.</small>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
