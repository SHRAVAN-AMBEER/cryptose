import React from "react";

const CryptoCard = ({ crypto }) => {
  return (
    <div className="card">
      <h3>{crypto.name}</h3>
      <p>Price: {crypto.price}</p>
      <p>Change: {crypto.change}</p>
    </div>
  );
};

export default CryptoCard;
