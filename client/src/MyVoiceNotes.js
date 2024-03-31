import React, { useEffect, useState } from "react";
import "./MyVoiceNotes.css";
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

function MyVoiceNotes({ userInfo, signOutUser }) {
    const [currentProfile, setProfile] = useState([]);
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        getRecordings();
    }, []);

    function getRecordings() {
        fetch("http://localhost:8000/getPosts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: userInfo.username,
                password: userInfo.password,
                secretKey: userInfo.secretKey
            })
        })
        .then(response => response.json())
        .then(data => {
            setUserPosts(data.posts); // Assuming posts are returned as an array in the response
        })
        .catch(error => {
            console.error("Error fetching posts:", error);
        });
    }

    // Other functions remain the same...

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
                {/* Render user posts */}
                <MyRecordingsContainer posts={userPosts} />
                <div></div>
            </section>

            <div id="createPost">
                <img src={microphone} alt="create post" onClick={toggleShowNewRecordingContainer}></img>
            </div>
            <CreateNewRecordingContainer userInfo={userInfo} />
        </div>
    );
}

export default MyVoiceNotes;
