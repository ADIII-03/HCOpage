import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/v1', // Hardcoded for development
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
        if (error.code === 'ERR_NETWORK') {
            return Promise.reject({
                ...error,
                message: 'Unable to connect to server. Please check if the server is running on port 8000.'
            });
        }

        if (error.response?.status === 401) {
            localStorage.removeItem('token');
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