import React from "react";

import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6">
      <h1 className="text-4xl font-bold text-center mb-4">
        Your AI-Powered Cryptocurrency Tracking Platform
      </h1>
      <p className="text-lg text-gray-300 text-center mb-6">
        Track crypto trends with smart insights.
      </p>

      <div className="flex space-x-4">
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          onClick={() => navigate("/signup")}
        >
          Get Started
        </button>
        <button 
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition"
          onClick={() => navigate("/markets")}
        >
          Market Prices
        </button>
      </div>

      {/* Why Choose CRYPTOSE Section */}
      <section className="mt-12 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-center mb-6">Why Choose CRYPTOSE?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Real-Time Crypto Tracking</h3>
            <p className="text-gray-400">Get up-to-date market insights on all major cryptocurrencies.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-400">Predict market trends with AI-driven insights.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Customizable Watchlists</h3>
            <p className="text-gray-400">Track the coins that matter most to you.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
