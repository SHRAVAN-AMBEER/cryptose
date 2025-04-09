import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = false; // Change dynamically based on auth state

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side - Logo & Home */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-2xl font-bold hover:text-gray-400">
            CRYPTOSE
          </Link>
          <Link to="/" className="hover:text-gray-400 transition">Home</Link>
        </div>

        {/* Right Side - Back Button & Profile Dropdown */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700 transition"
          >
            ⬅ Back
          </button>

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700 transition"
            >
              Profile
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 shadow-lg rounded-md">
                {!isLoggedIn ? (
                  <>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 hover:bg-gray-700 transition"
                    >
                      Sign Up
                    </Link>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-gray-700 transition"
                    >
                      Login
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-700 transition"
                  >
                    View Profile
                  </Link>
                  
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
