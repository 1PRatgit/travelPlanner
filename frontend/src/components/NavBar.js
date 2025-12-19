// src/components/NavBar.jsx
import { useState, useEffect } from "react";
import TripCreate from "./tripForm/TripCreate";
import { useAuth } from "../contexts/AuthContext";
import { Link,Navigate, useNavigate } from "react-router-dom";

export default function NavBar({ onTripCreated }) {
  const [showModal, setShowModal] = useState(false);
  const {logout, user } = useAuth();
  const navigate = useNavigate();
  const isActuallyLoggedIn = !!user;
  // closes modal when ESC or backdrop clicked
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && setShowModal(false);
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const handleOpen = () => setShowModal(true);
    window.addEventListener("openTripModal", handleOpen);
    return () => window.removeEventListener("openTripModal", handleOpen);
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("modal")) setShowModal(false);
  };

  const handleTripCreated = (trip) => {
    // notify parent (if any) and close modal
    setShowModal(false);
    if (onTripCreated) onTripCreated(trip);
    window.location.reload();
  };
  const handleLogout = () => {
    logout();
     window.location.replace("/");
  };
  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light"
        role="navigation"
        aria-label="Main navigation"
        style={{ backgroundColor: "#ffd6e8" }} // rose background
      >
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center ms-4" to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-geo-alt me-2"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M12.166 8.94C12.665 8.118 13 7.208 13 6a5 5 0 1 0-10 0c0 1.208.335 2.118.834 2.94C5.62 10.948 7.1 13.01 8 14c.9-.99 2.38-3.052 4.166-5.06zM8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
            </svg>
            <span className="fs-5 fw-bold">travel planner</span>
          </Link>

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
          {isActuallyLoggedIn ?(
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              <li className="nav-item me-4">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item me-4">
                <Link className="nav-link" to="/profile">My Trips</Link>
              </li>
              <li className="nav-item me-4">
                <Link className="nav-link" to="/SeasonalDeals">Seasonal Deals</Link>
              </li>

              {/* {userActive && ( */}
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
              {/* )} */}

              
                <li className="nav-item d-flex align-items-center me-4">
                  <button
                    className="btn btn-link nav-link p-0 d-flex align-items-center"
                    onClick={handleLogout}
                    aria-label="Logout"
                    title="Logout"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      fill="currentColor"
                      className="bi bi-box-arrow-right me-2"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
                      />
                      <path
                        fillRule="evenodd"
                        d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                      />
                    </svg>
                    <span className="ms-1">Logout</span>
                  </button>
                </li>
             
            </ul>
          </div>
          ):
         
          (<div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              <li className="nav-item me-4">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item me-4">
                <Link className="nav-link" to="/login">Login/Signup</Link>
              </li>
              <li className="nav-item me-4">
                <Link className="nav-link" to="/SeasonalDeals">Seasonal Deals</Link>
              </li>
            </ul>
          </div>
          )
          }
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
                  Create a New Trip
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              
              <div className="modal-body">
                <TripCreate user_id={user.id} onTripCreated={handleTripCreated} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
