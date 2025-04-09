import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide back button if coming from Profile page to Signup
  if (location.pathname.includes("/signup")) {
    return null; // Don't show the back button
  }

  return (
    <button
      className="fixed top-4 left-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition"
      onClick={() => navigate(-1)}
    >
      ← Back
    </button>
  );
};

export default BackButton;
