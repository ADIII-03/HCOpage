import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center p-6">
      {/* 404 Error Message */}
      <h1 className="text-9xl font-bold text-gray-800">404</h1>
      <h2 className="text-4xl font-semibold text-gray-700 mt-4">Page Not Found</h2>

      {/* Friendly Message */}
      <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
        Oops! The page you're looking for doesn't exist. It might have been moved or deleted. Let's get you back on track!
      </p>

      {/* Call-to-Action Button */}
      <Link
        to="/"
        className="mt-8 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}