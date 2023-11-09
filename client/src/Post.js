import "./Post.css";
import userIcon from "./user.png";
import React from "react";

import playButton from "./play.svg";
import pauseButton from "./pause.svg";

import like from "./like.svg";
import listens from "./listens.svg";

export default function Post({ post }) {
    function toggleLike(event) {
        event.target.classList.toggle("liked");
    }

    function setPosition(e) {
        let audioElement = e.target.parentNode.parentNode.querySelector("audio");
        let customTrack = e.target.parentNode.querySelector(".customTrack");
        customTrack.style.width = (e.target.value / e.target.max) * 100 + "%";
        console.log((e.target.value / e.target.maxValue) * 100);
        audioElement.onTimeUpdate = () => {};
        audioElement.currentTime = e.target.value;
        audioElement.onTimeUpdate = (e) => {
            audioChanged(e);
        };
    }
    function playAudio(e) {
        let audioElement = e.target.parentNode.querySelector("audio");
        if (audioElement.paused) {
            e.target.src = pauseButton;
            audioElement.play();
        } else {
            e.target.src = playButton;
            audioElement.pause();
        }
    }
    function audioChanged(e) {
        let audioElement = e.target;
        let radioSelector = e.target.parentNode.parentNode.querySelector(".audioBar");
        let customTrack = e.target.parentNode.parentNode.querySelector(".customTrack");
        radioSelector.value = audioElement.currentTime;
        customTrack.style.width = (radioSelector.value / radioSelector.max) * 100 + "%";
    }

    var date = new Date(post.postData.dateCreated)
        .toLocaleDateString("en-us", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        .toString();
    return (
        <div className="postContainer">
            <div id="authorInfo">
                <img src={userIcon}></img>
                <div id="handles">
                    <h3 id="author">{post.postData.authorName}</h3>
                    <h4>@{post.postData.author}</h4>
                </div>
            </div>
            <h3 id="title">{post.postData.title}</h3>

            <div className="customSlider">
                <input
                    className="audioBar"
                    type="range"
                    min={0}
                    max={post.postData.duration}
                    step={0.01}
                    onInput={(e) => setPosition(e)}
                ></input>
                <div className="customTrack"></div>
            </div>

            <button onClick={(e) => playAudio(e)}>
                <img src={playButton}></img>
                <audio
                    // style={{ display: "none" }}
                    className="audio"
                    src={post.audioURL}
                    preload="auto"
                    onTimeUpdate={(e) => audioChanged(e)}
                ></audio>
            </button>

            <h4>{post.postData.duration} seconds</h4>
            <div id="post_description">
                Description: <p>{post.postData.description}</p>
            </div>
            <div id="post_stats">
                {date.toLocaleString("en-US")}
                <div id="viewsLikes">
                    <img src={listens} alt="listens"></img>
                    {post.postData.views} <img onClick={toggleLike} id="post_like_icon" src={like} alt="listens"></img>
                    {post.postData.likes}
                </div>
            </div>
        </div>
    );
}
