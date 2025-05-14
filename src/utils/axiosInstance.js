import axios from 'axios';

// Use environment variables with fallbacks
const baseURL = (import.meta.env.VITE_API || 'http://localhost:8000/api/v1').replace(/\/+$/, '');

const axiosInstance = axios.create({
    baseURL,
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
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Log request details in development
        if (import.meta.env.DEV) {
            console.log('API Request:', {
                url: `${config.baseURL}${config.url}`,
                method: config.method,
                headers: config.headers
            });
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle auth errors and network issues
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Log full error details in development
        if (import.meta.env.DEV) {
            console.error('API Error:', {
                url: `${error.config?.baseURL}${error.config?.url}`,
                method: error.config?.method,
                status: error.response?.status,
                data: error.response?.data,
                headers: error.config?.headers
            });
        }

        // Network errors
        if (error.code === 'ERR_NETWORK') {
            console.error('Network Error:', {
                url: error.config?.url,
                method: error.config?.method,
                baseURL: error.config?.baseURL
            });
            return Promise.reject({
                ...error,
                message: import.meta.env.DEV 
                    ? 'Network error. Please check your internet connection and ensure the backend server is running.'
                    : 'Unable to connect to the server. Please try again later.'
            });
        }

        // 404 errors
        if (error.response?.status === 404) {
            console.error('404 Error:', {
                url: `${error.config?.baseURL}${error.config?.url}`,
                method: error.config?.method
            });
            return Promise.reject({
                ...error,
                message: import.meta.env.DEV
                    ? `API endpoint not found: ${error.config?.url}`
                    : 'The requested resource was not found.'
            });
        }

        // Authentication errors
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/admin';
            return Promise.reject({
                ...error,
                message: 'Your session has expired. Please log in again.'
            });
        }

        // Rate limiting
        if (error.response?.status === 429) {
            return Promise.reject({
                ...error,
                message: 'Too many requests. Please try again later.'
            });
        }

        // Server errors
        if (error.response?.status >= 500) {
            console.error('Server Error:', {
                status: error.response.status,
                data: error.response.data,
                url: error.config?.url
            });
            return Promise.reject({
                ...error,
                message: import.meta.env.DEV 
                    ? error.response?.data?.message || error.message
                    : 'An unexpected error occurred. Our team has been notified.'
            });
        }

        // Handle CORS errors specifically
        if (error.response?.status === 403 && error.response?.data?.message?.includes('CORS')) {
            console.error('CORS Error:', {
                origin: window.location.origin,
                target: error.config?.url
            });
            return Promise.reject({
                ...error,
                message: import.meta.env.DEV
                    ? `CORS error: ${error.response.data.message}`
                    : 'Unable to connect to the server. Please try again later.'
            });
        }

        const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
        return Promise.reject({
            ...error,
            message: errorMessage
        });
    }
);

export default axiosInstance;