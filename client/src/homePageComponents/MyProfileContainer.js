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

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <div id="myProfileContainer">
            <div id="authorInfo">
                <img src={userIcon}></img>
                <div id="handles">
                    <h3 id="author">{userInfo.displayName}</h3>
                    <h4>@{userInfo.username}</h4>
                </div>
            </div>
            {expanded && (
                <div id="expandedProfileContent">
                    <IconSelector />
                    <input placeholder="username" defaultValue={userInfo.username}></input>

                    <button className="button">Save</button>
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
            </div>
        </div>
    );
}
