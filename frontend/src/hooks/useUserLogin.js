import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axiosInstance';

const useUserLogin = () => {
    const { setUser } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        setMessage(null);
        
        // Create FormData for form-urlencoded content
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        
        try {
            const response = await api.post('/users/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            
            setUser(response.data);
            setMessage({
                type: "success",
                text: "Login successful!",
            });
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.detail || err.response?.data?.message || err.message || 'Login failed';
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

    return { login, error, loading, message };
};

export default useUserLogin;