import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    const { username, email, password } = formData;

    if (!email || !password || !username) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      alert(data.message || "Admin registered!");

      localStorage.setItem("admin", JSON.stringify({ email, password, role: "Admin" }));
      navigate("/login");
    } catch (err) {
      alert("Signup failed!");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-6">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-600">
          Admin Signup
        </h2>
        <input
          type="text"
          name="username"
          placeholder="👤 Full Name"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-800 text-white border border-gray-600 rounded-lg"
        />
        <input
          type="email"
          name="email"
          placeholder="📧 Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-800 text-white border border-gray-600 rounded-lg"
        />
        <input
          type="password"
          name="password"
          placeholder="🔑 Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-800 text-white border border-gray-600 rounded-lg"
        />
        <button
          onClick={handleSignup}
          className="w-full bg-yellow-600 text-white py-3 rounded-lg shadow-lg hover:bg-yellow-700 transition transform hover:scale-105"
        >
          ✅ Signup
        </button>
      </div>
    </div>
  );
};

export default AdminSignup;
