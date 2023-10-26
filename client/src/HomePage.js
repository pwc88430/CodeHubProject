import React from "react";
import "./HomePage.css";
import MyRecordingContainer from "./MyRecordingContainer";
import RecordingPage from "./RecordingPage";

function HomePage({ userInfo, signOutUser }) {
    function getRecordings() {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8000/getPosts");
        xhr.setRequestHeader("Content-Type", "application/json");

        const body = {
            username: userInfo.username,
            password: userInfo.password,
            secretKey: userInfo.secretKey,
        };

        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                return xhr.response;
            } else {
                console.log(`Error: ${xhr.status}`);
            }
        };
        xhr.send(JSON.stringify(body));
    }

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
            <RecordingPage userInfo={userInfo} />
        </>
    );
}

export default HomePage;
