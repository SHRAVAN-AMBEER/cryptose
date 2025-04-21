import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

function MemberDashboard() {
  const [coins, setCoins] = useState([]);
  const [selectedCoins, setSelectedCoins] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/member-market-data")
      .then((res) => res.json())
      .then((data) => setCoins(Array.isArray(data) ? data : []))
      .catch((error) => {
        console.error("Error fetching market data:", error);
        setCoins([]);
      });
  }, []);

  const handleCheckboxChange = (coinId) => {
    setSelectedCoins((prev) =>
      prev.includes(coinId)
        ? prev.filter((id) => id !== coinId)
        : [...prev, coinId]
    );
  };

  const handleCompare = () => {
    if (selectedCoins.length >= 2) {
      navigate(`/compare-graph?coins=${selectedCoins.join(",")}`);
    } else {
      alert("Please select at least two coins to compare.");
    }
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h2>👑 Member Dashboard - Market Overview</h2>
        <div className="actions">
          <button className="refresh-btn" onClick={() => window.location.reload()}>🔄 Refresh</button>
          <button className="compare-btn" onClick={handleCompare}>📊 Compare Selected</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Logo</th>
            <th>Name</th>
            <th>Price (USD)</th>
            <th>Market Cap</th>
            <th>Change (24h)</th>
            <th>Status</th>
            <th>Total Volume</th>
            <th>All-Time High</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => {
            const isTrending = coin.price_change_percentage_24h > 0;
            return (
              <tr key={coin.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCoins.includes(coin.id)}
                    onChange={() => handleCheckboxChange(coin.id)}
                  />
                </td>
                <td>
                  <img src={coin.image} alt={coin.name} style={{ width: "32px", height: "32px" }} />
                </td>
                <td>{coin.name}</td>
                <td>${coin.current_price.toLocaleString()}</td>
                <td>${coin.market_cap.toLocaleString()}</td>
                <td style={{ color: isTrending ? "green" : "red", fontWeight: "bold" }}>
                  {isTrending ? "▲" : "▼"} {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td>{isTrending ? "🔥 Trending" : "📉 Falling"}</td>
                <td>${coin.total_volume.toLocaleString()}</td>
                <td>${coin.ath.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default MemberDashboard;
