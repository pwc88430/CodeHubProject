import React from 'react';
import './HomePage.css';

function HomePage() {
  return (
    <header className="page-header">
      <div className="left-content">
        <img src="/logo.png" alt="logo" className="logo" />
        <div className="title">
        <h1>VOX</h1>
        <span>SOCIALIS</span>
        </div>
        <button className="home-button">
          <img src="/homeButton.png" alt="home" />
        </button>
        <div className="search-bar">
        <input type="text" placeholder="Search" />
        <button className="search-button">
          <img src="/searchIcon.png" alt="search" />
        </button>
      </div>
      </div>
      <div className="right-content">
        <button className="message-button">
          <img src="/messageButton.png" alt="messages" />
        </button>
        <button className="notification-button">
          <img src="/notiBell.png" alt="notifications" />
        </button>
        <button className="profile-button">
          <img src="/user.png" alt="userPFP" />
        </button>
        <p>Username</p>
        <button className="arrow">
          <img src="/notificationArrow.png" alt="userPFP" />
        </button>
      </div>
    </header>
  );
}

export default HomePage;

