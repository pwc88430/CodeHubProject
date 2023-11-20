import userIcon from "../user.png";
import { useState } from "react";
import React, { useEffect } from "react";
import "./MyProfileContainer.css";
import IconSelector from "./IconSelector";

export default function MyProfileContainer({ userInfo }) {
    const [extraInfo, setExtraInfo] = useState("extraInfo");
    const [expanded, setExpanded] = useState(false);

    function getUserData() {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8000/getExtraUserData");
        xhr.setRequestHeader("Content-Type", "application/json");

        const body = {
            username: userInfo.username,
            password: userInfo.password,
            secretKey: userInfo.secretKey,
            targetUser: userInfo.username,
        };

        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                setExtraInfo(JSON.parse(xhr.response));
                icon = extraInfo.icon;
                console.log(JSON.parse(xhr.response));
                return xhr.response;
            } else {
                console.log(`Error: ${xhr.status}`);
            }
        };
        xhr.send(JSON.stringify(body));
    }

    function handleEditClick(event) {
        console.log(event.target.parent);
        event.target.parentNode.classList.toggle("expanded");
        setExpanded(!expanded);
        console.log(expanded);
    }

    var icon = null;
    function setIcon(newIcon) {
        icon = newIcon;
    }

    function updateUserData() {
        const xhr2 = new XMLHttpRequest();
        xhr2.open("POST", "http://localhost:8000/updateUserData");
        xhr2.setRequestHeader("Content-Type", "application/json");

        const newUsernameEl = document.querySelector("#newUsernameInput");
        const authorEl = document.querySelector("#author");
        const newIconHolderEl = document.querySelector("#new_icon_container");
        const iconEls = newIconHolderEl.querySelectorAll("img");

        authorEl.innerHTML = newUsernameEl.value;
        userInfo.displayName = newUsernameEl.value;

        const body = {
            username: userInfo.username,
            newUsername: newUsernameEl.value,
            newUserIcon: icon || userIcon.userIcon,
        };
        xhr2.onload = () => {
            if (xhr2.readyState === 4 && xhr2.status === 200) {
                setExtraInfo(JSON.parse(xhr2.response));
                console.log(JSON.parse(xhr2.response));
                return xhr2.response;
            } else {
                console.log(`Error: ${xhr2.status}`);
            }
        };
        xhr2.send(JSON.stringify(body));
    }

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <div id="myProfileContainer">
            <div id="authorInfo">
                <img src={userInfo.userIcon}></img>
                <div id="handles">
                    <h3 id="author">{userInfo.displayName}</h3>
                    <h4>@{userInfo.username}</h4>
                </div>
            </div>
            {expanded && (
                <div id="expandedProfileContent">
                    <IconSelector setIcon={setIcon} />
                    <input id="newUsernameInput" defaultValue={userInfo.displayName}></input>

                    <button className="button" onClick={updateUserData}>
                        Save
                    </button>
                </div>
            )}
            <button onClick={handleEditClick} id="editButton">
                Edit
            </button>

            <hr></hr>
            <div id="postsInfo">
                <div>
                    <p>Posts:</p>
                    <p>{extraInfo.posts}</p>
                </div>
                <div>
                    <p>Likes:</p>
                    <p>{extraInfo.likes}</p>
                </div>
                <div>
                    <p>Views:</p>
                    <p>{extraInfo.views}</p>
                </div>
                <div>
                    <p>Following</p>
                    <p>{extraInfo.following}</p>
                </div>
            </div>
        </div>
    );
}
