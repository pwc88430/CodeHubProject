import React from "react";
import "./HomePage.css";
import MyRecordingContainer from "./MyRecordingContainer";
import RecordingPage from "./RecordingPage";
import MyProfileContainer from "./homePageComponents/MyProfileContainer";
import CreateNewRecordingContainer from "./homePageComponents/CreateNewRecordingContainer";
import MyFeedContainer from "./homePageComponents/MyFeedContainer";
import MyRecordingsContainer from "./homePageComponents/MyRecordingsContainer";
import SearchContainer from "./homePageComponents/SearchContainer";

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

    function toProfileView() {
        const homePageContainerEl = document.querySelector("#homePageContainer");
        if (homePageContainerEl.classList.contains("newRecordingMyRecordings")) {
            homePageContainerEl.removeAttribute("class");
            homePageContainerEl.classList.add("profileMyRecordings");
        } else if (homePageContainerEl.classList.contains("newRecordingSearch")) {
            homePageContainerEl.removeAttribute("class");
            homePageContainerEl.classList.add("profileSearch");
        }
    }

    function toMyRecordingsView() {
        const homePageContainerEl = document.querySelector("#homePageContainer");
        if (homePageContainerEl.classList.contains("profileSearch")) {
            homePageContainerEl.removeAttribute("class");
            homePageContainerEl.classList.add("profileMyRecordings");
        } else if (homePageContainerEl.classList.contains("newRecordingSearch")) {
            homePageContainerEl.removeAttribute("class");
            homePageContainerEl.classList.add("newRecordingMyRecordings");
        }
    }

    function toCreateView() {
        const homePageContainerEl = document.querySelector("#homePageContainer");
        if (homePageContainerEl.classList.contains("profileMyRecordings")) {
            homePageContainerEl.removeAttribute("class");
            homePageContainerEl.classList.add("newRecordingMyRecordings");
        } else if (homePageContainerEl.classList.contains("profileSearch")) {
            homePageContainerEl.removeAttribute("class");
            homePageContainerEl.classList.add("newRecordingSearch");
        }
    }

    function toSearchView() {
        const homePageContainerEl = document.querySelector("#homePageContainer");
        if (homePageContainerEl.classList.contains("profileMyRecordings")) {
            homePageContainerEl.removeAttribute("class");
            homePageContainerEl.classList.add("profileSearch");
        } else if (homePageContainerEl.classList.contains("newRecordingMyRecordings")) {
            homePageContainerEl.removeAttribute("class");
            homePageContainerEl.classList.add("newRecordingSearch");
        }
    }

    return (
        <div id="homePageContainer" className="profileMyRecordings">
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

                <button id="back" className="button" onClick={signOutUser}>
                    Sign Out
                </button>
            </header>

            <MyProfileContainer toProfileView={toProfileView} userInfo={userInfo} />
            <MyFeedContainer />
            <MyRecordingsContainer toMyRecordingsView={toMyRecordingsView} userInfo={userInfo} />
            <CreateNewRecordingContainer toCreateView={toCreateView} userInfo={userInfo} />
            <SearchContainer toSearchView={toSearchView} />
        </div>
    );
}

export default HomePage;
