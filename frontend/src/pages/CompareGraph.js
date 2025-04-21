import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function CompareGraph() {
  const [imageSrc, setImageSrc] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const coins = params.get("coins");

    if (coins) {
      fetch(`http://127.0.0.1:5000/api/compare?coins=${coins}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.image) setImageSrc(`data:image/png;base64,${data.image}`);
          else alert("No image returned.");
        })
        .catch((err) => {
          console.error("Error fetching comparison graph:", err);
          alert("Failed to load comparison graph.");
        });
    }
  }, [location.search]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">📊 Comparison Chart</h1>
      {imageSrc ? (
        <img src={imageSrc} alt="Comparison Graph" className="rounded-lg shadow-lg max-w-full" />
      ) : (
        <p className="text-gray-400">Loading graph...</p>
      )}
    </div>
  );
}

export default CompareGraph;
