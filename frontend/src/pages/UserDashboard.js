import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

function UserDashboard() {
  const [coins, setCoins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchData = () => {
    fetch("http://127.0.0.1:5000/api/market-data")
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

  const handleUpgrade = () => setShowModal(true);
  const confirmUpgrade = () => navigate("/signup/member");

  return (
    <div className="dashboard">
      <div className="header">
        <h2>📈 Trending Cryptocurrencies</h2>
        <div className="actions">
          <button className="refresh-btn" onClick={fetchData}>🔄 Refresh</button>
          <button className="premium-btn" onClick={handleUpgrade}>🚀 Get Premium</button>
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
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => {
            const isTrending = coin.price_change_percentage_24h > 0;
            return (
              <tr key={coin.id}>
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
              </tr>
            );
          })}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Upgrade to Member?</h3>
            <p>Get exclusive premium features by becoming a Member!</p>
            <div className="modal-actions">
              <button onClick={confirmUpgrade} className="modal-confirm">Yes, Sign Me Up!</button>
              <button onClick={() => setShowModal(false)} className="modal-cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
