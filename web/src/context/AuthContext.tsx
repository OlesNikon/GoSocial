import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiService } from '../services/api';
import type { User, LoginPayload, RegisterPayload, UserWithToken } from '../types';
import { AuthContext } from './AuthContext.types';
import type { AuthContextType } from './AuthContext.types';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Initialize state from localStorage
    const getInitialUser = (): User | null => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    };

    const getInitialToken = (): string | null => {
        return localStorage.getItem('token');
    };

    const [user, setUser] = useState<User | null>(getInitialUser);
    const [token, setToken] = useState<string | null>(getInitialToken);
    const [isLoading] = useState(false);

    useEffect(() => {
        // Set token in API service if it exists
        if (token) {
            apiService.setToken(token);
        }
    }, [token]);

    const login = async (payload: LoginPayload) => {
        const token = await apiService.login(payload);

        if (!token) {
            throw new Error('No token received from server');
        }

        // Set token first before making any authenticated requests
        apiService.setToken(token);

        // Decode JWT to get user ID
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            const decoded = JSON.parse(jsonPayload);

            console.log('Decoded JWT user ID:', decoded.sub);
            console.log('Token set, fetching user data...');

            // Fetch user data from the server using the user ID
            const userData = await apiService.getUser(decoded.sub);

            console.log('User data received:', userData);

            // Only update state after successful user fetch
            setToken(token);
            setUser(userData);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (err) {
            console.error('Failed to fetch user data:', err);
            // Clear token on error
            apiService.setToken(null);
            throw new Error('Failed to authenticate: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const register = async (payload: RegisterPayload): Promise<UserWithToken> => {
        const response = await apiService.register(payload);
        // Note: Registration requires email activation, so we don't auto-login
        return response;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        apiService.setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
