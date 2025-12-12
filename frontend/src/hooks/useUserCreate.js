import { useState } from 'react';
import api from '../api/axiosInstance';

const useUserCreate = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const createUser = async (userData) => {
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const response = await api.post('/users/signup', userData);
            setMessage({
                type: "success",
                text: "User created successfully!",
            });
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Signup failed';
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

    return { createUser, loading, error, message };
};

export default useUserCreate;