import React from "react";

const OfflineBanner = () => {
  return (
    <div className="offline-message">
      <div className="offline-icon">📶</div>
      <h2>You're offline</h2>
      <p>No worries! You can still play Routle while offline.</p>
    </div>
  );
};

export default OfflineBanner;
