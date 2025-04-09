import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Retrieve stored credentials
    const adminData = JSON.parse(localStorage.getItem("admin"));
    const memberData = JSON.parse(localStorage.getItem("member"));
    const userData = JSON.parse(localStorage.getItem("user"));

    // Validate input with stored credentials
    if (adminData && adminData.email === email && adminData.password === password) {
      alert("Admin Login Successful!");
      navigate("/AdminDashboard");
    } else if (memberData && memberData.email === email && memberData.password === password) {
      alert("Member Login Successful!");
      navigate("/MemberDashboard");
    } else if (userData && userData.email === email && userData.password === password) {
      alert("User Login Successful!");
      navigate("/UserDashboard");
    } else {
      alert("Invalid Email or Password!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white px-6">
      <h1 className="text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Welcome Back!
      </h1>

      <div className="bg-gray-900 p-8 rounded-lg shadow-xl w-96 border border-gray-700">
        <input
          type="email"
          placeholder="📧 Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg mb-4"
        />
        <input
          type="password"
          placeholder="🔑 Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg mb-4"
        />
        <button 
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
        >
          🔓 Login
        </button>
      </div>
    </div>
  );
};

export default Login;

