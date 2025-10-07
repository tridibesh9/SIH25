import { jwtDecode } from 'jwt-decode';
import { backend_url } from '../api endpoints/backend_url';

/**
 * Check if token is expired or will expire soon (within 5 minutes)
 */
export const isTokenExpiring = (token) => {
    if (!token) return true;
    
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        const fiveMinutes = 5 * 60;
        
        // Return true if token is expired or will expire in 5 minutes
        return decoded.exp < (currentTime + fiveMinutes);
    } catch (err) {
        console.error('Error checking token expiry:', err);
        return true;
    }
};

/**
 * Check if token is completely expired
 */
export const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        return decoded.exp < currentTime;
    } catch (err) {
        console.error('Error checking token expiry:', err);
        return true;
    }
};

/**
 * Refresh the authentication token
 */
export const refreshToken = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        throw new Error('No token available');
    }

    try {
        const response = await fetch(`${backend_url}/users/renew-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Token refresh failed');
        }

        // Update token in localStorage
        localStorage.setItem('token', data.token);
        console.log('Token refreshed successfully');
        
        return data.token;
    } catch (err) {
        console.error('Token refresh error:', err);
        // Clear auth data on refresh failure
        clearAuthData();
        throw err;
    }
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
};

/**
 * Get authentication headers for API calls
 */
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

/**
 * Make an authenticated API request with automatic token refresh
 */
export const authenticatedFetch = async (url, options = {}) => {
    let token = localStorage.getItem('token');
    
    // Check if token needs refresh
    if (isTokenExpiring(token)) {
        console.log('Token expiring soon, refreshing...');
        try {
            token = await refreshToken();
        } catch (err) {
            console.error('Failed to refresh token:', err);
            // Redirect to login will be handled by the caller
            throw new Error('Authentication required');
        }
    }

    // Make the request with current token
    const response = await fetch(url, {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...options.headers
        }
    });

    // If we get 401, token might be invalid - try to refresh once
    if (response.status === 401) {
        console.log('Got 401, attempting token refresh...');
        try {
            token = await refreshToken();
            
            // Retry the request with new token
            const retryResponse = await fetch(url, {
                ...options,
                headers: {
                    ...getAuthHeaders(),
                    ...options.headers
                }
            });
            
            return retryResponse;
        } catch (err) {
            console.error('Token refresh failed on 401:', err);
            clearAuthData();
            throw new Error('Authentication required');
        }
    }

    return response;
};

/**
 * Check current authentication status
 */
export const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return { isAuthenticated: false };
    }

    if (isTokenExpired(token)) {
        clearAuthData();
        return { isAuthenticated: false };
    }

    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');

    return {
        isAuthenticated: true,
        userName,
        userRole
    };
};
