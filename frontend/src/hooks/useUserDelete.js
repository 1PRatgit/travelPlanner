import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axiosInstance';

const useUserDelete = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const deleteUser = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            await api.delete(`/users/${user.id}`);
            setUser(null);
            setMessage({
                type: "success",
                text: "User deleted successfully",
            });
            return true;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to delete user';
            setError(errorMsg);
            setMessage({
                type: "error",
                text: errorMsg,
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { deleteUser, loading, error, message };
};

export default useUserDelete;