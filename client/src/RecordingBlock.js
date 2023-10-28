function RecordingBlock({ audioURL, clipLabel, handleClick, chunks, userInfo }) {
    async function uploadClip() {
        console.log(chunks);

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
                },
                visibility: 0,
                postTitle: clipLabel,
                audioChunks: base64String,
                secretKey: userInfo.secretKey,
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

    return (
        <div className="RecordingBlock">
            <div id="recordingBlockComponent">
                <h4 id="audioTrackLabel">{clipLabel}</h4>
                <audio src={audioURL} controls></audio>
                <button onClick={handleClick} id="deleteTrackButton">
                    Delete
                </button>
            </div>
            <button id="uploadTrackButton" onClick={uploadClip}>
                Upload
            </button>
        </div>
    );
}

export default RecordingBlock;
