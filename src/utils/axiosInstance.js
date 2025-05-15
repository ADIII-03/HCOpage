import axios from 'axios';

// Use environment variables with fallbacks
const baseURL = import.meta.env.VITE_API || 'http://localhost:8000/api/v1';

console.log('API Base URL:', baseURL); // Log the base URL being used

// Create axios instance with proper configuration
const axiosInstance = axios.create({
    baseURL: baseURL.trim(),
    withCredentials: true,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add a request interceptor to add the auth token
axiosInstance.interceptors.request.use(
    (config) => {
        // Log all requests in both development and production
        console.log('API Request:', {
            url: `${config.baseURL}${config.url}`,
            method: config.method,
            data: config.data,
            headers: config.headers
        });

        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
    (response) => {
        // Log successful responses
        console.log('API Response:', {
            url: `${response.config.baseURL}${response.config.url}`,
            status: response.status,
            data: response.data
        });
        return response;
    },
    async (error) => {
        // Log detailed error information
        console.error('API Error:', {
            url: error.config ? `${error.config.baseURL}${error.config.url}` : 'No URL',
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        // Network errors
        if (!error.response) {
            return Promise.reject({
                ...error,
                message: 'Network error. Please check your internet connection.'
            });
        }

        // Handle specific error cases
        switch (error.response.status) {
            case 401:
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/admin';
                return Promise.reject({
                    ...error,
                    message: 'Your session has expired. Please log in again.'
                });

            case 403:
                return Promise.reject({
                    ...error,
                    message: 'Access denied. Please check your permissions.'
                });

            case 404:
                return Promise.reject({
                    ...error,
                    message: `The requested resource was not found: ${error.config.url}`
                });

            case 429:
                return Promise.reject({
                    ...error,
                    message: 'Too many requests. Please try again later.'
                });

            default:
                return Promise.reject({
                    ...error,
                    message: error.response.data?.message || 'An unexpected error occurred.'
                });
        }
    }
);

export default axiosInstance;