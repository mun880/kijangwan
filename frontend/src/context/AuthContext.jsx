import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // We might want to fetch full profile here, but decoded token has basic info
                setUser({
                    user_id: decoded.user_id,
                    role: decoded.role,
                    username: decoded.username
                });
            } catch (error) {
                console.error("Invalid token", error);
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await api.post('/auth/token/', credentials);
            const { access, refresh } = response.data;

            const decoded = jwtDecode(access);

            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);

            const userParams = {
                user_id: decoded.user_id,
                role: decoded.role,
                username: decoded.username
            };

            setUser(userParams);

            toast.success(`Welcome back!`);
            return userParams; // Return user object to allow redirect
        } catch (error) {
            console.error("Login failed", error);
            toast.error(error.response?.data?.detail || "Login failed");
            return null;
        }
    };

    const register = async (role, data) => {
        try {
            let endpoint = '/driver/register/';
            if (role === 'PASSENGER') endpoint = '/passenger/register/';

            await api.post(endpoint, data);
            toast.success("Registration successful! Please login.");
            return true;
        } catch (error) {
            console.error("Registration failed", error);
            const errorData = error.response?.data;
            let message = "Registration failed. Please check your data.";
            if (errorData) {
                // Collect first error from any field
                const firstError = Object.values(errorData)[0];
                if (Array.isArray(firstError)) message = firstError[0];
                else if (typeof firstError === 'string') message = firstError;
            }
            toast.error(message);
            return false;
        }
    }

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        toast.success("Logged out successfully");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
