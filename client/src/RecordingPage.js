import RecordingBlock from "./RecordingBlock";
import { useState } from "react";

//this is the recording page which gives users a ability to record and store several recordings
//there is also a audio visualizer functionality
export default function RecordingPage({ changeScreen }) {
    const [recordings, setRecordings] = useState([]);

    //checks to see if media recording device is available
    //if so, mediarecorder object is created and all buttons are assigned event handlers
    //if not, and error is thorwn
    //also there is the set up of the audio visualizer
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
                const record = document.querySelector("#record");
                const stop = document.querySelector("#stop");
                const soundClips = document.querySelector("#clips");
                const canvas = document.querySelector(".visualizer");

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

                        requestAnimationFrame(draw);

                        analyser.getByteTimeDomainData(dataArray);

                        canvasCtx.fillStyle = "rgb(256, 256, 256)";
                        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

                        canvasCtx.lineWidth = 0.5;
                        canvasCtx.strokeStyle = "	rgb(173, 216, 230)";

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

                // creates eventhandler for record button
                record.onclick = () => {
                    mediaRecorder.start();
                    visualize(stream);
                    console.log(mediaRecorder.state);
                    console.log("recorder started");
                    record.style.background = "red";
                    record.style.color = "black";
                };
                //creates chuncks array to hold audio data
                let chunks = [];

                mediaRecorder.ondataavailable = (e) => {
                    chunks.push(e.data);
                };
                //creates eventhandler for stop button
                stop.onclick = () => {
                    mediaRecorder.stop();
                    console.log(mediaRecorder.state);
                    console.log("recorder stopped");
                    record.style.background = "";
                    record.style.color = "";
                };
                mediaRecorder.onstop = (e) => {
                    console.log("recorder stopped");

                    //asks for the clip name
                    //this will be changed to that a prompt is not used
                    const clipName = prompt("Enter a name for your sound clip");
                    const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });

                    const audioURL = window.URL.createObjectURL(blob);
                    //adds recording info to state of RecordingPage object, triggering a re-render
                    setRecordings([
                        ...recordings,
                        {
                            url: audioURL,
                            name: clipName,
                            raw: blob,
                        },
                    ]);
                    chunks = [];
                };
            })

            // Error callback
            .catch((err) => {
                console.error(`The following getUserMedia error occurred: ${err}`);
            });
    } else {
        console.log("getUserMedia not supported on your browser!");
    }

    //maps the state array to an array RecordingBlock components, which is rendered
    const recordingListDisplay = recordings.map((recording, index) => {
        function deleteRecording(event) {
            let evtTgt = event.target;
            evtTgt.parentNode.parentNode.parentNode.removeChild(evtTgt.parentNode.parentNode);
            console.log("deleting recording");
        }
        return (
            <RecordingBlock
                key={index}
                audioURL={recording.url}
                clipLabel={recording.name}
                handleClick={deleteRecording}
                chunks={recording.raw}
            />
        );
    });

    return (
        <div id="recordingPage">
            <h1>Recording Page</h1>
            <canvas className="visualizer" height="60px"></canvas>
            <div id="record-buttons">
                <button className="button" id="record">
                    Start
                </button>
                <button className="button" id="stop">
                    Stop
                </button>
                <ol id="recordingList">{recordingListDisplay}</ol>
            </div>
            <button className="button" id="back" onClick={changeScreen}>
                Back
            </button>
            <div id="clips"></div>
        </div>
    );
}
