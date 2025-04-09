import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white px-6">
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <BackButton />
      </div>

      {/* Signup Heading */}
      <h1 className="text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Sign Up
      </h1>

      {/* Signup Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <button
          onClick={() => navigate("/signup/admin")}
          className="px-6 py-3 rounded-lg shadow-lg bg-blue-600 hover:bg-blue-700 transition transform hover:scale-105"
        >
          👑 Admin Signup
        </button>
        <button
          onClick={() => navigate("/signup/member")}
          className="px-6 py-3 rounded-lg shadow-lg bg-green-600 hover:bg-green-700 transition transform hover:scale-105"
        >
          🤝 Member Signup
        </button>
        <button
          onClick={() => navigate("/signup/user")}
          className="px-6 py-3 rounded-lg shadow-lg bg-purple-600 hover:bg-purple-700 transition transform hover:scale-105"
        >
          🧑‍💻 User Signup
        </button>
      </div>
    </div>
  );
};

export default Signup;
