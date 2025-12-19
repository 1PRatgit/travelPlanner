import React, { useEffect } from "react";
import { useState } from "react";
import api from "../../api/axiosInstance";
import TripCard from "./TripCard";
import useTripDelete from "../../hooks/useTripDelete";

export default function TripList({ trips: propTrips }) {  // Accept trips as prop
    const [getTrips, setGetTrips] = useState(propTrips || []);  // Use prop if available
    const [selectedTripId, setSelectedTripId] = useState(null);

    const { deleteTrip, message } = useTripDelete();

    const onViewDetails = async () => {
        try {
            const response = await api.get(`/trips/`);
            setGetTrips(response.data);
        } catch (error) {
            console.error("Error fetching trips:", error);
        }
    };

    // toggle selection so clicking again hides details
    const handleSelectTrip = (trip_id) => {
        setSelectedTripId(prev => (prev === trip_id ? null : trip_id));
    };

    useEffect(() => {
        // Inject minimal rose theme CSS once
        if (document.getElementById("triplist-rose-css")) return;
        const css = `
            .rose-card {
                background: linear-gradient(135deg,#ffeef8 0%,#ffd7ec 50%,#ffd0f0 100%);
                border: 1px solid rgba(200,50,120,0.15);
                color: #3a0022;
            }
            .rose-card .card-title { font-weight: 600; }
            .btn-rose {
                background: linear-gradient(90deg,#ff6fb5,#ff4e9e);
                color: white;
                border: none;
                box-shadow: 0 2px 6px rgba(255,82,147,0.18);
            }
            .btn-rose:hover {
                filter: brightness(0.95);
            }
        `;
        const style = document.createElement("style");
        style.id = "triplist-rose-css";
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);

        // Only fetch if no propTrips provided
        if (!propTrips) {
            onViewDetails();
        }
    }, [propTrips]);  // Depend on propTrips

    // Update local state when propTrips changes
    useEffect(() => {
        if (propTrips) {
            setGetTrips(propTrips);
        }
    }, [propTrips]);

    if (!Array.isArray(getTrips) || getTrips.length === 0) {
        return (
            <div className="text-center text-muted py-4">
                No trips yet
            </div>
        );
    }

    const handleDeleteTrip = async (trip_id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this trip?");
        if (!confirmDelete) return;

        await deleteTrip(trip_id);
        // Refresh: if using propTrips, assume parent handles refetch; else refetch here
        if (!propTrips) {
            await onViewDetails();
        }
    };

    return (
        <div className="container-fluid px-0">
            {getTrips.map((t) => (
                <React.Fragment key={t.id}>
                    <div className="card rose-card mb-3">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <h5 className="card-title mb-0">{t.title}</h5>
                            <div>
                                <div className="d-flex gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-rose"
                                        onClick={() => handleSelectTrip(t.id)}
                                    >
                                        {selectedTripId === t.id ? "Hide Details" : "View Details"}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-rose btn-icon"
                                        onClick={() => handleDeleteTrip(t.id)}
                                        title="Delete Trip"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Render TripCard immediately below the specific trip card */}
                    {selectedTripId === t.id && (
                        <div className="mb-3">
                            <TripCard trip_id={selectedTripId} />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}