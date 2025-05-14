import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";

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
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/admin/login", { 
        email, 
        password 
      });

      const { accessToken, refreshToken, user } = response.data.data;

      // Store tokens
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Update auth state
      login(user);

      console.log("Admin logged in successfully:", response.data.message);
      
      // Navigate back to the page they came from, or home if no previous page
      const returnPath = location.state?.from || "/";
      navigate(returnPath);

    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials and try again.");
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
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2 rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded-lg">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
