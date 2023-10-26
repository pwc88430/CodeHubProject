import React from "react";
import "./HomePage.css";

function HomePage({ userInfo, signOutUser }) {
    return (
        <>
            <header className="page-header">
                <img src="/logo.png" alt="logo" className="logo" />
                <div className="header-icons">
                    <button className="home-button">
                        <img src="/homeButton.png" alt="home" />
                    </button>
                    <button className="message-button">
                        <img src="/messageButton.png" alt="messages" />
                    </button>
                    <button className="notification-button">
                        <img src="/notiBell.png" alt="notifications" />
                    </button>
                </div>

                <button id="back" onClick={signOutUser}>
                    Sign Out
                </button>
            </header>
            <h1>Welcome {userInfo.username}!</h1>
        </>
    );
}

export default HomePage;
