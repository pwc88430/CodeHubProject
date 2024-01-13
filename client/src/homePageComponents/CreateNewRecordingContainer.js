import { useState, useEffect } from "react";

import "./CreateNewRecordingContainer.css";
import resetIcon from "./reset.svg";
import playPause from "./playPause.svg";
import StopWatch from "./StopWatch";
import { useRef } from "react";

export default function CreateNewRecordingContainer({ toCreateView, userInfo }) {
    let chunks = [];
    // Method to reset timer back to 0

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log("getUserMedia supported.");

        navigator.mediaDevices
            .getUserMedia(
                // constraints - only audio needed for this app
                {
                    audio: true,
                }
            )

            // Success callback
            .then((stream) => {
                const mediaRecorder = new MediaRecorder(stream);
                const record = document.querySelector("#record_button");
                const canvas = document.querySelector("#recording_visualizer");

                //creates chuncks array to hold audio data

                // sets up the audio visualizer
                let audioCtx;
                const canvasCtx = canvas.getContext("2d");
                function visualize(stream) {
                    if (!audioCtx) {
                        audioCtx = new AudioContext();
                    }

                    const source = audioCtx.createMediaStreamSource(stream);

                    const analyser = audioCtx.createAnalyser();
                    analyser.fftSize = 2048;
                    const bufferLength = analyser.frequencyBinCount;
                    console.log(bufferLength);
                    //const bufferLength = 100;
                    const dataArray = new Uint8Array(bufferLength);

                    source.connect(analyser);
                    //analyser.connect(audioCtx.destination);

                    draw();

                    function draw() {
                        const WIDTH = canvas.width;
                        const HEIGHT = canvas.height;

                        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

                        requestAnimationFrame(draw);

                        analyser.getByteTimeDomainData(dataArray);

                        canvasCtx.fillStyle = " #4a90e200";
                        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

                        canvasCtx.lineWidth = 2;
                        canvasCtx.strokeStyle = "rgb(255, 42, 0)";

                        canvasCtx.beginPath();

                        let sliceWidth = (WIDTH * 1.0) / bufferLength;
                        let x = 0;

                        for (let i = 0; i < bufferLength; i++) {
                            let v = dataArray[i] / 128;
                            let y = (v * HEIGHT) / 2;

                            if (i === 0) {
                                canvasCtx.moveTo(x, y);
                            } else {
                                canvasCtx.lineTo(x, y);
                            }

                            x += sliceWidth;
                        }

                        canvasCtx.lineTo(canvas.width, canvas.height / 2);
                        canvasCtx.stroke();
                    }
                }
                visualize(stream);

                // creates eventhandler for record button

                record.onclick = () => {
                    if (record.classList.contains("live")) {
                        record.classList.remove("live");

                        chunks = [];

                        mediaRecorder.stop();
                        console.log("stopped");
                        console.log(mediaRecorder.state);
                        console.log(chunks);
                    } else {
                        record.classList.add("live");

                        mediaRecorder.start();
                        console.log("started");
                        console.log(mediaRecorder.state);
                    }
                };

                mediaRecorder.ondataavailable = (e) => {
                    chunks.push(e.data);

                    console.log("puching Chunks");
                };
                //creates eventhandler for stop button

                mediaRecorder.onstop = () => {
                    console.log("recorder stopped");
                };
            })

            // Error callback
            .catch((err) => {
                console.error(`The following getUserMedia error occurred: ${err}`);
            });
    } else {
        console.log("getUserMedia not supported on your browser!");
    }

    async function uploadClip() {
        const textAreaEl = document.querySelector("#description_box");
        const clipNameEl = document.querySelector("#recording_title_input");

        if (clipNameEl.value == "") {
            // checking for a description

            console.log("no clip title entered");
        } else if (textAreaEl.value == "") {
            // checking for a clip title
            console.log("no description entered");
        } else if (chunks.length < 1) {
            console.log("please record some audio"); // checking to make sure recording is available
        } else {
            const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
            chunks = [];
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const audioURL = window.URL.createObjectURL(blob);

            const arrayBuffer = await blob.arrayBuffer();
            const decodedData = await audioContext.decodeAudioData(arrayBuffer);
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                var base64String = reader.result;

                // Simply Print the Base64 Encoded String,
                // without additional data: Attributes.
                console.log("Base64 String without Tags- ", base64String.substr(base64String.indexOf(", ") + 1));

                const xhr = new XMLHttpRequest();
                xhr.open("POST", "http://localhost:8000/createPost");
                xhr.setRequestHeader("Content-Type", "application/json");

                const body = JSON.stringify({
                    userData: {
                        username: userInfo.username,
                        displayName: userInfo.displayName,
                        password: userInfo.password,
                        userIcon: userInfo.userIcon,
                    },
                    visibility: 0,
                    postTitle: clipNameEl.value,
                    audioChunks: base64String,
                    duration: decodedData.duration,
                    secretKey: userInfo.secretKey,
                    description: textAreaEl.value,
                });
                console.log(userInfo.userIcon);

                xhr.onload = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        const result = JSON.parse(xhr.responseText);
                        if (result) {
                            textAreaEl.value = "";
                            clipNameEl.value = "";
                        }
                    } else {
                        console.log(`Error: ${xhr.status}`);
                    }
                };
                xhr.send(body);
            };
        }
    }

    const childRef = useRef();

    return (
        <div onClick={toCreateView} className="hidden" id="createNewRecordingContainer">
            <div id="blackBg" className="hidden"></div>
            <div id="recording_contents">
                <input id="recording_title_input" placeholder="My Post Title..."></input>
                <canvas id="recording_visualizer"></canvas>
                <StopWatch ref={childRef} />
                <div id="recording_buttons_container">
                    <img onClick={() => childRef.current.reset()} id="delete_recording_button" alt="X" src={resetIcon}></img>
                    <div id="record_button_ring">
                        <div onClick={() => childRef.current.startStop()} id="record_button"></div>
                    </div>
                    <img id="play_pause_button" src={playPause} alt="play/pause"></img>
                </div>
                <textarea maxLength="100" placeholder="This post is about..." id="description_box"></textarea>
                <div className="button" id="upload_button" onClick={uploadClip}>
                    Create Post
                </div>
            </div>
        </div>
    );
}
