import React from 'react';
import { useState,useEffect } from 'react';
import TripCreate from './tripForm/TripCreate';
import { ItineraryCreate } from './tripForm/ItineraryCreate';
export default function NavBar() {
  const [showModal, setShowModal] = useState(false);

  // closes modal when ESC or backdrop clicked
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && setShowModal(false);
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("modal")) setShowModal(false);
  };

  const handleTripCreated = (trip) => {
    console.log("Trip created:", trip);
    setShowModal(false);
  };
  return (
    <>
    <nav
      className="navbar navbar-expand-lg navbar-light"
      role="navigation"
      aria-label="Main navigation"
      style={{ backgroundColor: '#ffd6e8' }} // rose background
    >
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center ms-4" href="/">  {/* added ms-4 for left margin */}
          {/* location icon (left of title) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-geo-alt me-2"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path d="M12.166 8.94C12.665 8.118 13 7.208 13 6a5 5 0 1 0-10 0c0 1.208.335 2.118.834 2.94C5.62 10.948 7.1 13.01 8 14c.9-.99 2.38-3.052 4.166-5.06zM8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
          </svg>
          <span className="fs-5 fw-bold">travel planner</span>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item me-3">
              <a className="nav-link" href="/mytrips">MyTrips</a>
            </li>
            <li>
              <ItineraryCreate trip_id={2}/>
            </li>
              {/* New Trip Button */}
              <li className="nav-item me-3">
                <button
                  className="btn btn-rose fw-semibold"
                  onClick={() => setShowModal(true)}
                  style={{
                    backgroundColor: "#ffd6e8",
                    border: "1px solid #ffb6c1",
                    color: "#333",
                  }}
                >
                  + New Trip
                </button>
              </li>
            


            <li className="nav-item d-flex align-items-center me-4">  {/* added me-4 for right margin */}
              {/* user icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M13.468 12.37C12.758 11.226 11.5 10.5 8 10.5s-4.758.726-5.468 1.87A6.987 6.987 0 0 0 8 15a6.987 6.987 0 0 0 5.468-2.63z"/>
                <path fillRule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 1a7 7 0 1 0 .001 14.001A7 7 0 0 0 8 1z"/>
              </svg>
            </li>
          </ul>
        </div>
      </div>
    </nav> 
     {/* Modal (Bootstrap fade animation + backdrop click-to-close) */}
      {showModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1050,
          }}
          onClick={handleBackdropClick}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
          >
            <div className="modal-content shadow-lg">
              <div
                className="modal-header"
                style={{ borderBottomColor: "#ffd6e8" }}
              >
                <h5 className="modal-title fw-bold text-primary">
                  {/* Create a New Trip */}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                <TripCreate onTripCreated={handleTripCreated} />
              </div>
            </div>
          </div>
        </div>
      )}
      </>
  );
}