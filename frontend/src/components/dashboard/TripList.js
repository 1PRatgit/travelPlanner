import React, { useEffect } from "react";
import { useState } from "react";
import api from "../../api/axiosInstance";
import TripCard from "./TripCard";


export default function TripList({}) {
    const[getTrips, setGetTrips] = useState([])
    const [selectedTripId, setSelectedTripId] = useState(null); // <-- new state

     const onViewDetails =async ()=>{
        try {
            const response = await api.get(`/trips/`);
            setGetTrips (response.data);
        } catch (error) {
            console.error("Error fetching trips:", error);
        }
    }

    // toggle selection so clicking again hides details
    const handleSelectTrip = (trip_id) => {
        setSelectedTripId(prev => (prev === trip_id ? null : trip_id));
    }

    
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

        // Initial load of trips
        onViewDetails();
    }, []);

    if (!Array.isArray(getTrips) || getTrips.length === 0) {
        return (
            <div className="text-center text-muted py-4">
                No trips yet
            </div>
        );
    }

    return (
        <div className="container-fluid px-0">
            {getTrips.map((t) => (
                <React.Fragment key={t.id}>
                    <div className="card rose-card mb-3">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <h5 className="card-title mb-0">{t.title}</h5>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-rose"
                                    onClick={() => handleSelectTrip(t.id)}
                                >
                                    {selectedTripId === t.id ? "Hide Details" : "View Details"}
                                </button>
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