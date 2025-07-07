import { Link } from "react-router-dom";
import syborg_logo from "../src/assets/images/syborg_logo.png"; 
const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 text-center animate__animated animate__fadeIn">
      {/* Logo */}
      <img
        src={syborg_logo}
        alt="Syborg Logo"
        className="w-24 h-24 mb-4 drop-shadow-lg animate__animated animate__bounceIn"
      />

      {/* 404 Text */}
      <h1 className="text-7xl font-extrabold text-blue-600 mb-2 drop-shadow-sm">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Oops! Page not found.
      </h2>
      <p className="text-gray-600 max-w-sm mb-6">
        The page you’re looking for doesn’t exist or was moved. Let's get you back on track.
      </p>

      {/* Button */}
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300"
      >
        ⬅️ Back to Homepage
      </Link>
    </div>
  );
};

export default NotFound;