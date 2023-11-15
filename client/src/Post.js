import "./Post.css";
import userIcon from "./user.png";
import React from "react";
import { useRef, useEffect } from "react";

import playButton from "./play.svg";
import pauseButton from "./pause.svg";

import like from "./like.svg";
import listens from "./listens.svg";

export default function Post({ post, userInfo }) {
    function toggleLike(element, changeLikes) {
        element.classList.toggle("liked");
        let elementText = element.parentNode.querySelector("p");

        if (!changeLikes) return;

        if (element.className.includes("liked")) {
            elementText.textContent = parseInt(elementText.textContent) + 1;
        } else {
            elementText.textContent = parseInt(elementText.textContent) - 1;
        }

        console.log(post.postData.author + ":" + post.postData.dateCreated);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8000/likePost");
        xhr.setRequestHeader("Content-Type", "application/json");

        const body = {
            username: userInfo.username,
            password: userInfo.password,
            secretKey: userInfo.secretKey,
            postId: post.postData.author + ":" + post.postData.dateCreated,
        };

        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.response);
                return xhr.response;
            } else {
                console.log(`Error: ${xhr.status}`);
            }
        };
        xhr.send(JSON.stringify(body));
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

    // const recordingWaveformContainerEl = document.querySelector("#recording_waveform_container");
    // const myDivEl = document.querySelector("#mydiv");
    const canvas = document.querySelector("canvas");
    const audioEl = document.querySelector("audio");
    // let totalWidth = recordingWaveformContainerEl.offsetWidth;

    // const playPauseButtonEl = document.querySelector("#play_pause_post_button");

    // playPauseButtonEl.addEventListener("click", () => {
    //     if (audioEl.paused) {
    //         audioEl.play();
    //     } else {
    //         audioEl.pause();
    //     }
    // });

    // audioEl.addEventListener("timeupdate", () => {
    //     let duration = audioEl.duration;
    //     let currentTime = audioEl.currentTime;
    //     let ratio = currentTime / duration;

    //     console.log(ratio * totalWidth);

    //     let newWidth = ratio * totalWidth;
    //     let newerWidth = totalWidth - newWidth;
    //     console.log(newerWidth);
    //     myDivEl.style.width = newerWidth + "px";
    // });

    // myDivEl.addEventListener("click", (event) => {
    //     let rect = myDivEl.getBoundingClientRect();
    //     let newWidth = event.clientX - rect.left;
    //     myDivEl.style.width = myDivEl.offsetWidth - newWidth + "px";

    //     let ratio = myDivEl.offsetWidth / totalWidth;
    //     console.log(ratio);
    //     let newRatio = 1 - ratio;
    //     console.log(newRatio);
    //     let newTime = audioEl.duration * newRatio;
    //     console.log(newTime);
    //     audioEl.currentTime = newTime;
    // });
    // canvas.addEventListener("click", (event) => {
    //     let rect = canvas.getBoundingClientRect();
    //     let newWidth = event.clientX - rect.left;
    //     myDivEl.style.width = canvas.offsetWidth - newWidth + "px";
    //     let ratio = newWidth / totalWidth;
    //     let newTime = audioEl.duration * ratio;
    //     audioEl.currentTime = newTime;
    // });

    // Set up audio context
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    /**
     * Retrieves audio from an external source, then initializes the drawing function
     * @param {String} url the url of the audio we'd like to fetch
     */
    console.log(post.audioURL);
    const drawAudio = async (url) => {
        //const audio = await new Audio(url);
        await fetch(url)
            .then((response) => response.arrayBuffer())
            .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
            .then((audioBuffer) => draw(normalizeData(filterData(audioBuffer))));
    };

    /**
     * Filters the AudioBuffer retrieved from an external source
     * @param {AudioBuffer} audioBuffer the AudioBuffer from drawAudio()
     * @returns {Array} an array of floating point numbers
     */
    const filterData = (audioBuffer) => {
        const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
        const samples = 200; // Number of samples we want to have in our final data set
        const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
        const filteredData = [];
        for (let i = 0; i < samples; i++) {
            let blockStart = blockSize * i; // the location of the first sample in the block
            let sum = 0;
            for (let j = 0; j < blockSize; j++) {
                sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
            }
            filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
        }
        return filteredData;
    };

    /**
     * Normalizes the audio data to make a cleaner illustration
     * @param {Array} filteredData the data from filterData()
     * @returns {Array} an normalized array of floating point numbers
     */
    const normalizeData = (filteredData) => {
        const multiplier = Math.pow(Math.max(...filteredData), -1);
        return filteredData.map((n) => n * multiplier);
    };

    /**
     * Draws the audio file into a canvas element.
     * @param {Array} normalizedData The filtered array returned from filterData()
     * @returns {Array} a normalized array of data
     */
    const draw = (normalizedData) => {
        // set up the canvas

        const dpr = window.devicePixelRatio || 1;
        const padding = 20;
        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = (canvas.offsetHeight + padding * 2) * dpr;
        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
        ctx.translate(0, canvas.offsetHeight / 2 + padding); // set Y = 0 to be in the middle of the canvas

        // draw the line segments
        const width = canvas.offsetWidth / normalizedData.length;
        for (let i = 0; i < normalizedData.length; i++) {
            const x = width * i;
            let height = normalizedData[i] * canvas.offsetHeight - padding;
            if (height < 0) {
                height = 0;
            } else if (height > canvas.offsetHeight / 2) {
                height = height > canvas.offsetHeight / 2;
            }
            drawLineSegment(ctx, x, height, width, (i + 1) % 2);
        }
    };

    /**
     * A utility function for drawing our line segments
     * @param {AudioContext} ctx the audio context
     * @param {number} x  the x coordinate of the beginning of the line segment
     * @param {number} height the desired height of the line segment
     * @param {number} width the desired width of the line segment
     * @param {boolean} isEven whether or not the segmented is even-numbered
     */
    const drawLineSegment = (ctx, x, height, width, isEven) => {
        ctx.lineWidth = 2; // how thick the line is
        ctx.strokeStyle = "#FFA500"; // what color our line is
        ctx.beginPath();
        height = isEven ? height : -height;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
        ctx.lineTo(x + width, 0);
        ctx.stroke();
    };
    console.log(post.audioURL);
    //drawAudio(post.audioURL);

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

            {/* <div>
                <audio ref={audioEl} controls src={post.audioURL}></audio>
                <div id="recording_waveform_container">
                    <div id="mydiv"></div>
                    <canvas id="song"></canvas>
                </div>
                <button id="play_pause_post_button">Play/Pause</button>
            </div> */}

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
                    <div style={{ display: "flex" }}>
                        <img src={listens} alt="listens"></img>
                        <p>{post.postData.views}</p>
                    </div>
                    <div style={{ display: "flex" }}>
                        <img
                            onLoad={(e) => {
                                if (post.liked) {
                                    toggleLike(e.target, false);
                                }
                            }}
                            onClick={(e) => toggleLike(e.target, true)}
                            id="post_like_icon"
                            src={like}
                            alt="listens"
                        ></img>
                        <p>{post.postData.likes}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
