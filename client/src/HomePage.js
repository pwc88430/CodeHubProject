import React from "react";
import "./HomePage.css";
import MyProfileContainer from "./homePageComponents/MyProfileContainer";
import CreateNewRecordingContainer from "./homePageComponents/CreateNewRecordingContainer";
import MyFeedContainer from "./homePageComponents/MyFeedContainer";
import MyRecordingsContainer from "./homePageComponents/MyRecordingsContainer";
import SearchContainer from "./homePageComponents/SearchContainer";
import FiltersContainer from "./homePageComponents/FiltersContainer";

import logo from "./icon.svg";
import microphone from "./microphone.svg";

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

    function displayNewRecording() {
        let newRecording = document.getElementById("createNewRecordingContainer");
        if (newRecording.style.display != "none") {
            newRecording.style.display = "none";
        } else {
            newRecording.style.display = "block";
        }
    }

    return (
        <div id="homePageContainer" className="profileMyRecordings">
            <header className="page-header">
                <img src={logo} alt="logo" className="logo" />

                <button id="signOutButton" className="button" onClick={signOutUser}>
                    Sign Out
                </button>

                <SearchContainer />
            </header>

            <section className="wrapper">
                <div></div>
                <MyFeedContainer userInfo={userInfo} />
                <div></div>
            </section>

            <CreateNewRecordingContainer userInfo={userInfo} />

            <div id="createPost" onClick={displayNewRecording}>
                <img src={microphone} alt="create post"></img>
            </div>
            {/* <FiltersContainer /> */}
            {/* <MyProfileContainer toProfileView={toProfileView} userInfo={userInfo} /> */}
            {/* <MyRecordingsContainer userInfo={userInfo} /> */}
        </div>
    );
}

export default HomePage;
