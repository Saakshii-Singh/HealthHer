import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50 
    bg-white/70 backdrop-blur-lg shadow-lg rounded-full px-6 py-3 flex justify-between items-center border border-pink-100">

      {/* LOGO */}
      <h1 className="text-xl font-bold text-pink-500 flex items-center gap-2">
        HealthHer <FaHeart className="text-pink-400" />
      </h1>

      {/* LINKS */}
      <div className="flex gap-6 items-center text-gray-600 font-medium">

        <Link to="/" className="hover:text-pink-500 transition">
          Home
        </Link>

        <Link to="/dashboard" className="hover:text-pink-500 transition">
          Dashboard
        </Link>

        <Link to="/tracker" className="hover:text-pink-500 transition">
          Tracker
        </Link>

        {user ? (
          <>
            {/* PROFILE LINK */}
            <Link 
              to="/profile" 
              className="flex items-center gap-2 hover:text-pink-500 transition"
            >
              <FaUserCircle className="text-xl" />
              {user.name}
            </Link>

            {/* LOGOUT */}
            <button
              onClick={() => {
                localStorage.removeItem("userInfo");
                navigate("/login");
              }}
              className="bg-pink-500 text-white px-4 py-2 rounded-full shadow hover:bg-pink-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-pink-500 transition">
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-pink-500 text-white px-4 py-2 rounded-full shadow hover:bg-pink-600 transition"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
