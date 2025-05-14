import axios from 'axios';

// Use the environment variable for API URL
const baseURL = 'https://hco-backend.onrender.com/api/v1';

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 60000, // Increase timeout to 60 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add CORS headers
    config.headers = {
      ...config.headers,
      'Origin': 'https://hc-opage.vercel.app'
    };

    // Add auth token if exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request for debugging
    console.log('Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error for debugging
    console.error('Response Error:', {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      message: error.message,
      response: error.response?.data
    });

    // Handle 401 and token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios({
          method: 'POST',
          url: `${baseURL}/admin/refresh-token`,
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`,
            'Origin': 'https://hc-opage.vercel.app',
            'Content-Type': 'application/json'
          }
        });

        const { accessToken, refreshToken } = response.data.data;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      return Promise.reject({
        ...error,
        message: 'Unable to connect to the server. Please check your internet connection and try again.'
      });
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        ...error,
        message: 'The request timed out. Please try again.'
      });
    }

    // Handle CORS errors
    if (error.message?.includes('CORS')) {
      return Promise.reject({
        ...error,
        message: 'Unable to access the server due to CORS restrictions. Please try again later.'
      });
    }

    // Handle other errors
    return Promise.reject({
      ...error,
      message: error.response?.data?.message || error.message || 'An unexpected error occurred'
    });
  }
);

export default axiosInstance;