import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserSignup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (!email || !password) {
      alert("Please enter valid email and password!");
      return;
    }

    // Save admin credentials to localStorage
    localStorage.setItem("user", JSON.stringify({ email, password, role: "User" }));

    alert("User Signup Successful!");
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-6">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
          User Signup
        </h2>
        <input
          type="email"
          placeholder="📧 Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-800 text-white border border-gray-600 rounded-lg"
        />
        <input
          type="password"
          placeholder="🔑 Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-800 text-white border border-gray-600 rounded-lg"
        />
        <button
          onClick={handleSignup}
          className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
        >
          ✅ Signup
        </button>
      </div>
    </div>
  );
};

export default UserSignup;
