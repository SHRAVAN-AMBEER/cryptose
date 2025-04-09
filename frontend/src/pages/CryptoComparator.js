import React, { useEffect, useState } from 'react';

const CryptoComparator = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [selectedCoins, setSelectedCoins] = useState([]);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/crypto');
        const data = await response.json();
        setCryptoData(data);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    };

    fetchCryptoData();
  }, []);

  const handleSelect = (coin) => {
    setSelectedCoins((prev) =>
      prev.includes(coin) ? prev.filter((c) => c !== coin) : [...prev, coin]
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>🔍 Crypto Comparator</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
      {Array.isArray(cryptoData) && cryptoData.map((coin, index) => (
          <li key={index}>
            <label>
              <input
                type="checkbox"
                onChange={() => handleSelect(coin)}
                checked={selectedCoins.includes(coin)}
              />
              {' '}
              {coin.name} (${coin.current_price})
            </label>
          </li>
        ))}
      </ul>

      {selectedCoins.length >= 2 && (
        <div>
          <h2>📊 Comparison Table</h2>
          <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Symbol</th>
                <th>Price (USD)</th>
                <th>Market Cap</th>
                <th>24h Change (%)</th>
                <th>Total Volume</th>
                <th>Rank</th>
              </tr>
            </thead>
            <tbody>
              {selectedCoins.map((coin, index) => (
                <tr key={index}>
                  <td>{coin.name}</td>
                  <td>{coin.symbol.toUpperCase()}</td>
                  <td>${coin.current_price.toLocaleString()}</td>
                  <td>${coin.market_cap.toLocaleString()}</td>
                  <td style={{ color: coin.price_change_percentage_24h >= 0 ? 'green' : 'red' }}>
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td>${coin.total_volume.toLocaleString()}</td>
                  <td>{coin.market_cap_rank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CryptoComparator;
