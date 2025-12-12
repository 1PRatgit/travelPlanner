import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {useUserTrips} from '../../hooks/useUserTrips';
import { useNavigate } from 'react-router-dom';

const TripList = () => {
  const { user } = useAuth();
  const { trips, loading, error } = useUserTrips(user?.id);
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <div className="card shadow-sm border-0" style={{ borderRadius: "10px" }}>
        <div
          className="card-header text-center"
          style={{
            backgroundColor: "#fff",
            borderBottom: "2px solid #ffd6e8",
          }}
        >
          <h3 className="fw-bold mb-0" style={{ color: "#c2185b" }}>
            ✈️ Your Trips
          </h3>
        </div>

        <div className="card-body px-4 py-4">
          {loading && <p className="text-muted text-center">Loading trips...</p>}
          {error && <div className="alert alert-danger">{error}</div>}
          {trips && trips.length > 0 ? (
            <ul className="list-group">
              {trips.map((trip) => (
                <li
                  key={trip.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                  style={{ borderLeft: "4px solid #ffd6e8" }}
                >
                  <div>
                    <strong>{trip.destination}</strong>
                    <br />
                    <small className="text-muted">{trip.date}</small>
                  </div>
                  <button
                    className="btn btn-sm"
                    style={{
                      backgroundColor: "#ffd6e8",
                      border: "1px solid #ffb6c1",
                      color: "#333",
                    }}
                    onClick={() => navigate(`/trips/${trip.id}`)}
                  >
                    View
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted text-center">No trips yet. Start planning your adventure!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripList;