import React from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // Import Chart.js

const COLORS = [
  "rgba(54, 162, 235, 0.7)",
  "rgba(255, 99, 132, 0.7)",
  "rgba(255, 206, 86, 0.7)",
  "rgba(75, 192, 192, 0.7)",
  "rgba(153, 102, 255, 0.7)",
  "rgba(255, 159, 64, 0.7)",
];

const CryptoGraph = ({ coinName = "Coin", priceData = [], labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"], datasets = null }) => {
  const navigate = useNavigate(); // Navigation hook

  // Prepare graph data using passed props
  const graphData = {
    labels: labels,
    datasets: datasets || [
      {
        label: coinName + " Price Trend",
        data: priceData,
        borderColor: COLORS[0],
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
