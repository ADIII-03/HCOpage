import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError("");

    // Show loading toast
    const loadingToast = toast.loading("Logging in...");

    try {
      const response = await axiosInstance.post("/admin/login", { 
        email, 
        password 
      });

      const { data } = response.data;
      
      if (!data || !data.accessToken || !data.user) {
        throw new Error("Invalid response from server");
      }

      // Store tokens and user data with expiry
      const expiryTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour from now
      const userData = {
        ...data.user,
        expiryTime,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      };
      
      localStorage.setItem("userData", JSON.stringify(userData));

      // Update auth state
      login(data.user);

      // Update toast to success
      toast.update(loadingToast, {
        render: "Successfully logged in!",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });

      // Navigate back to the page they came from, or home if no previous page
      const returnPath = location.state?.from || "/";
      navigate(returnPath);

    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials and try again.";
      
      // Update toast to error
      toast.update(loadingToast, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
      
      setError(errorMessage);
      setEmail("");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in-down">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Admin Login</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500">
              <Mail className="text-gray-400 mr-3" size={20} />
              <input
                type="email"
                className="w-full bg-transparent focus:outline-none text-sm"
                placeholder="Enter your admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500">
              <Lock className="text-gray-400 mr-3" size={20} />
              <input
                type="password"
                className="w-full bg-transparent focus:outline-none text-sm"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2 rounded-xl transition-all duration-200 shadow-lg 
              ${loading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:scale-105 hover:shadow-xl active:scale-95'}`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </div>
            ) : "Login"}
          </button>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded-lg">
              {error}
            </div>
          )}
        </form>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Login;
