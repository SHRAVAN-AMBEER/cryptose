import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900">Welcome to Your Profile</h2>
      <p className="text-gray-600 mt-2">Manage your crypto portfolio.</p>

      <div className="mt-6">
        {!showOptions ? (
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
            onClick={() => setShowOptions(true)}
          >
            Get Started
          </button>
        ) : (
          <div className="flex flex-col space-y-4">
            <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition" onClick={() => navigate("/signup/admin")}>
              Signup as Admin
            </button>
            <button className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition" onClick={() => navigate("/signup/member")}>
              Signup as Member
            </button>
            <button className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition" onClick={() => navigate("/signup/user")}>
              Signup as User
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
