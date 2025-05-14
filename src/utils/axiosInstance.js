import axios from 'axios';

const baseURL = import.meta.env.VITE_API || 'http://localhost:8000/api/v1';
console.log('Environment:', import.meta.env.MODE); // Log environment
console.log('API URL:', baseURL); // Log API URL

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 30000, // 30 second timeout for file uploads
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
        // Log request details (remove in production later)
        console.log('Request:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            withCredentials: config.withCredentials
        });
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
    (response) => {
        // Log successful responses (remove in production later)
        console.log('Response:', {
            status: response.status,
            data: response.data
        });
        return response;
    },
    async (error) => {
        // Detailed error logging
        console.error('API Error Details:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            data: error.response?.data,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                headers: error.config?.headers,
                withCredentials: error.config?.withCredentials
            }
        });

        if (error.code === 'ERR_NETWORK') {
            return Promise.reject({
                ...error,
                message: 'Network error. Please check your internet connection and ensure the backend server is running.'
            });
        }

        // Handle authentication errors
        if (error.response?.status === 401) {
            console.log('Authentication error, clearing credentials...');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Add a small delay before redirect to ensure logging
            setTimeout(() => {
                window.location.href = '/admin';
            }, 100);
        }

        const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
        return Promise.reject({
            ...error,
            message: errorMessage
        });
    }
);

export default axiosInstance;