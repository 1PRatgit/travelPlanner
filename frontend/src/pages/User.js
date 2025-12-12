import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import UserProfile from '../components/user/UserProfile';
import TripList from '../components/trips/TripList';
const User = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <div>Please log in to view your profile and trips.</div>;
    }

    return (
        <div>
            <h1>User Profile</h1>
            <UserProfile user={user} />
            <h2>Your Trips</h2>
            <TripList />
        </div>
    );
};

export default User;