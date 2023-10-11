
function RecordingBlock({ audioURL, clipLabel, handleClick, chunks }) {

    async function uploadClip() {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8000/createPost");
        xhr.setRequestHeader("Content-Type", "application/json")

        const body = JSON.stringify(

            {
                userData: {
                    userName: "super1234",
                    displayName: "John"
                },
                postTitle: clipLabel,
                audioChunks: chunks
            }

        )
        xhr.onload = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(JSON.parse(xhr.responseText));
            } else {
                console.log(`Error: ${xhr.status}`);
            }
        };
        xhr.send(body);
    }


    return (
        <div className="RecordingBlock">
            <div id="recordingBlockComponent">
                <h4 id='audioTrackLabel'>{clipLabel}</h4>
                <audio src={audioURL} controls></audio>
                <button onClick={handleClick} id="deleteTrackButton">Delete</button>
            </div>
            <button id="uploadTrackButton" onClick={uploadClip}>Upload</button>

        </div>
    );

}

export default RecordingBlock