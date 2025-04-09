import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

function MemberDashboard() {
  const [coins, setCoins] = useState([]);
  const navigate = useNavigate();

  const fetchData = () => {
    fetch("http://127.0.0.1:5000/api/member-market-data")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCoins(data);
        else setCoins([]);
      })
      .catch((error) => {
        console.error("Error fetching market data:", error);
        setCoins([]);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRowClick = (coinId) => {
    navigate(`/graph/${coinId}`);
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h2>👑 Member Dashboard - Market Overview</h2>
        <div className="actions">
          <button className="refresh-btn" onClick={fetchData}>🔄 Refresh</button>
          <button className="compare-btn" onClick={() => navigate("/compare")}>🔍 Compare Cryptos</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
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
              <tr key={coin.id} onClick={() => handleRowClick(coin.id)} className="clickable-row">
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
