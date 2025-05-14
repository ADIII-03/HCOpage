import axios from 'axios';

const baseURL = 'https://hco-backend.onrender.com/api/v1';  // Production backend URL

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
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        console.error('API Error:', error);
        if (error.code === 'ERR_NETWORK') {
            return Promise.reject({
                ...error,
                message: 'Network error. Please check your internet connection.'
            });
        }

        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/admin';
        }

        const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
        return Promise.reject({
            ...error,
            message: errorMessage
        });
    }
);

export default axiosInstance;