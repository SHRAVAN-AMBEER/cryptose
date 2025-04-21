import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CoinGraph() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imgData, setImgData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/coin-history/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.image) setImgData(`data:image/png;base64,${data.image}`);
        if (Array.isArray(data.history)) setHistory(data.history);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching coin graph:", err);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        📊 {id.toUpperCase()} Price Trend
      </h2>

      {loading ? (
        <div className="text-xl text-gray-600 animate-pulse mt-20">Loading graph and data...</div>
      ) : (
        <>
          {imgData && (
            <div className="flex justify-center">
              <img
                src={imgData}
                alt={`${id} price chart`}
                className="w-full max-w-4xl rounded-2xl shadow-lg border border-gray-300"
              />
            </div>
          )}

          {history.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">📅 Historical Data</h3>
              <div className="overflow-x-auto">
                <table className="mx-auto w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Price (USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((point, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="px-4 py-2 text-gray-800">{point.date}</td>
                        <td className="px-4 py-2 text-green-600 font-medium">
                          ${parseFloat(point.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      <button
        onClick={() => navigate("/userdashboard")}
        className="mt-10 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
      >
        ⬅️ Back to Dashboard
      </button>
    </div>
  );
}

export default CoinGraph;
