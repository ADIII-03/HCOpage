import axios from 'axios';

// Use the environment variable for API URL
const baseURL = 'https://hco-backend.onrender.com/api/v1';

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 30000, // 30 second timeout for file uploads
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': 'https://hc-opage.vercel.app'
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Ensure CORS headers are present
    config.headers['Origin'] = 'https://hc-opage.vercel.app';
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 and token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const { data } = await axios.post(
          'https://hco-backend.onrender.com/api/v1/admin/refresh-token',
          {},
          {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`,
              'Origin': 'https://hc-opage.vercel.app'
            }
          }
        );

        const { accessToken, refreshToken } = data.data;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Clear auth data and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error:', {
        message: error.message,
        config: error.config
      });
      return Promise.reject({
        ...error,
        message: 'Network error. Please check your internet connection.'
      });
    }

    // Handle CORS errors
    if (error.code === 'ERR_NETWORK' && error.message.includes('CORS')) {
      console.error('CORS Error:', {
        message: error.message,
        config: error.config
      });
      return Promise.reject({
        ...error,
        message: 'Access error. Please try again later.'
      });
    }

    // Log all errors for debugging
    console.error('API Error:', {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
      config: error.config
    });

    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject({
      ...error,
      message: errorMessage
    });
  }
);

export default axiosInstance;