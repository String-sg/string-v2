import React from 'react';
import './PinnedApps.css'; // Assuming there's a CSS file for styling

const PinnedApps = ({ apps }) => {
  const handleClick = (event, url) => {
    event.preventDefault(); // Prevent default behavior of any parent handlers
    event.stopPropagation(); // Stop event propagation to parent components
    console.log('Redirecting to URL:', url); // Debug: Log the URL being opened
    window.open(url, '_blank', 'noopener,noreferrer'); // Open the URL in a new tab
  };

  return (
    <div className="pinned-apps-container">
      {apps.map((app) => {
        console.log('App URL:', app.url); // Debug: Check if app.url is correct
        return (
          <div
            key={app.id}
            className="pinned-app"
            onClick={(event) => handleClick(event, app.url)}
          >
            <div className="app-icon">{app.icon}</div>
            <div className="app-name">{app.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default PinnedApps;
