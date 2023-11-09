import { useState } from "react";

function RecordingBlock({ audioURL, clipLabel, handleClick, duration, chunks, userInfo }) {
    const [enteredDescription, setEnteredDescription] = useState("");

    function updateDescription(event) {
        setEnteredDescription(event.target.value);
    }

    async function uploadClip() {
        const textAreaEl = document.querySelector("#newDescription");

        if (textAreaEl.value == "") {
            console.log("no description entered");
        } else if (clipLabel == "") {
            console.log("no clip title entered");
        } else {
            var reader = new FileReader();
            reader.readAsDataURL(chunks);
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
                    postTitle: clipLabel,
                    audioChunks: base64String,
                    duration: duration,
                    secretKey: userInfo.secretKey,
                    description: enteredDescription,
                });

                xhr.onload = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        console.log(JSON.parse(xhr.responseText));
                    } else {
                        console.log(`Error: ${xhr.status}`);
                    }
                };
                xhr.send(body);
            };
        }
    }

    const [currentCount, setCurrentCount] = useState(0);

    function handleWcChange(event) {
        setCurrentCount(event.target.value.length);
    }

    return (
        <div className="RecordingBlock">
            <div id="recordingBlockComponent">
                <h4 id="audioTrackLabel">{clipLabel}</h4>
                <audio src={audioURL} controls></audio>
                <h4 id="newDescription">Description</h4>
                <textarea onChange={updateDescription} maxlength="100"></textarea>
            </div>

            <button id="uploadTrackButton" onClick={uploadClip}>
                Upload
            </button>
        </div>
    );
}

export default RecordingBlock;
