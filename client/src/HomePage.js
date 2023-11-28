import React, { useEffect, useState } from "react";
import "./HomePage.css";
import MyProfileContainer from "./homePageComponents/MyProfileContainer";
import CreateNewRecordingContainer from "./homePageComponents/CreateNewRecordingContainer";
import MyFeedContainer from "./homePageComponents/MyFeedContainer";
import MyRecordingsContainer from "./homePageComponents/MyRecordingsContainer";
import SearchContainer from "./homePageComponents/SearchContainer";
import FiltersContainer from "./homePageComponents/FiltersContainer";
import DropdownMenu from "./DropDownMenu";

import logo from "./icon.svg";
import microphone from "./microphone.svg";
import userIcon from "./user.png";

function HomePage({ userInfo, signOutUser }) {
    const [currentProfile, setProfile] = useState([]);

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

    function toggleShowNewRecordingContainer() {
        const createNewRecordingContainerEl = document.querySelector("#createNewRecordingContainer");
        const backgroundBlurEl = document.querySelector("#blackBg");
        createNewRecordingContainerEl.classList.toggle("hidden");
        backgroundBlurEl.classList.toggle("hidden");
    }

    let loadingMore = true;
    var oldOffsetY = 0;
    function checkForMoreAudio() {
        if (document.getElementById("loadMoreAudio") == null) return;
        let moreAudio = document.getElementById("loadMoreAudio");
        let rectY = moreAudio.getBoundingClientRect().y;
        if (moreAudio.offsetTop != oldOffsetY) {
            console.log("changed");
            loadingMore = false;
            oldOffsetY = moreAudio.offsetTop;
        }
        if (rectY <= (window.innerHeight || document.documentElement.clientHeight)) {
            if (!loadingMore) {
                loadingMore = true;
                document.getElementById("loadMoreAudio").click();
            }
        }
    }

    function mouseOver() {
        console.log("moused over");
        const hoverContainerEl = document.querySelector("#profileButtonExpanded");
        hoverContainerEl.classList.toggle("hovered");
    }

    useEffect(() => {
        oldOffsetY = document.getElementById("loadMoreAudio").offsetTop;
        setProfile(<MyProfileContainer userInfo={userInfo} currentUser={true}></MyProfileContainer>);
        var checkAudio = setInterval(checkForMoreAudio, 1000);
    }, []);

    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const handleMouseEnter = () => {
        setDropdownVisible(true);
    };

    const handleMouseLeave = () => {
        setDropdownVisible(false);
    };

    function changeProfile(req) {
        console.log("Changing profile to: " + req + "\nYou are: " + userInfo.username);
        if (req === userInfo.username) {
            setProfile(<MyProfileContainer userInfo={userInfo} currentUser={true}></MyProfileContainer>);
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8000/getPublicUserData");
        xhr.setRequestHeader("Content-Type", "application/json");

        const body = {
            username: userInfo.username,
            password: userInfo.password,
            secretKey: userInfo.secretKey,
            targetUsername: req,
        };

        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                setProfile(<MyProfileContainer userInfo={JSON.parse(xhr.response)} currentUser={false}></MyProfileContainer>);
            } else {
                console.log(`Error: ${xhr.status}`);
            }
        };
        xhr.send(JSON.stringify(body));
    }

    return (
        <div id="homePageContainer" className="profileMyRecordings">
            <header className="page-header">
                <img src={logo} alt="logo" className="logo" />

                <button id="profileButton" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <img src={sessionStorage.getItem("voxUserIcon")}></img>

                    {isDropdownVisible && <DropdownMenu signOut={signOutUser} />}
                </button>

                <SearchContainer userInfo={userInfo} />
            </header>

            <section className="wrapper">
                {currentProfile}
                <MyFeedContainer changeProfile={changeProfile} userInfo={userInfo} />
                <div></div>
            </section>

            <div id="createPost">
                <img src={microphone} alt="create post" onClick={toggleShowNewRecordingContainer}></img>
            </div>
            <CreateNewRecordingContainer userInfo={userInfo} />
        </div>
    );
}

export default HomePage;
