import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1", // your backend URL
  withCredentials: true, // enables sending cookies
});

export default axiosInstance;
