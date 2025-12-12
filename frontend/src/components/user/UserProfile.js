import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {useUserTrips} from '../../hooks/useUserTrips';
import TripCard from '../dashboard/TripCard';
import NavBar from '../NavBar';
const UserProfile = () => {
    const [showModal, setShowModal] = useState(false); // optional: if you want to open modal from profile too
    const { user, updateUser } = useAuth();
    const { trips } = useUserTrips(user?.id ?? null);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    const handleUpdate = (e) => {
        e.preventDefault();
        updateUser({ name, email });
    };
    const handleTripCreated = (trip) => {
        // console.log("Trip created:", trip);
        setShowModal(false);
        // refetch handled by hook if implemented
    };
    const openNewTrip = () => {
    window.dispatchEvent(new Event('openTripModal'));
  };
    return (
        <div className="user-profile" style={{ backgroundColor: "#fff5fa", minHeight: "100vh" }}>
            <NavBar userActive={true} onTripCreated={handleTripCreated} />
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
                        {/* show user name */}
                        {/* {trips.forEach(t => console.log(t.id))} */}

                        👤 {user?.username}
                    </h3>
                </div>

                {/* Trips list */}
                <div className="card-body">
                    {trips && trips.length > 0 ? (
                        trips.map(t => <TripCard key={t.id} trip_id={t.id} />)
                    ) : (
                        <p className="text-muted">No trips yet. Start planning your adventure!</p>
                    )}
                </div>

                
                </div>
            </div>

        </div>
    );
};

export default UserProfile;