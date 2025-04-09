import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // Import Chart.js

const CryptoGraph = () => {
  const { coinName } = useParams(); // Get coin name from URL
  const navigate = useNavigate(); // Navigation hook

  // Dummy price trend data
  const dummyTrends = {
    Bitcoin: [64000, 65000, 66000, 67000, 68000],
    Ethereum: [3100, 3150, 3200, 3250, 3300],
    "Binance Coin": [400, 410, 420, 430, 440],
    Solana: [130, 135, 140, 145, 150],
  };

  // Generate graph data
  const graphData = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
    datasets: [
      {
        label: `${coinName} Price Trend`,
        data: dummyTrends[coinName] || [100, 120, 140, 160, 180], // Default trend if not found
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
      >
        🔙 Back
      </button>

      {/* 📈 Coin Trend Graph */}
      <div className="mt-8 w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">📈 {coinName} Trend</h2>
        <Line data={graphData} />
      </div>

    </div>
  );
};

export default CryptoGraph;
