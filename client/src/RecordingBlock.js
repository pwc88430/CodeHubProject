
function RecordingBlock({ audioURL, clipLabel, handleClick }) {




    return (
        <div className="RecordingBlock">
            <div id="recordingBlockComponent">
                <h4 id='audioTrackLabel'>{clipLabel}</h4>
                <audio src={audioURL} controls></audio>
                <button onClick={handleClick} id="deleteTrackButton">Delete</button>
            </div>
            <button id="uploadTrackButton">Upload</button>

        </div>
    );

}

export default RecordingBlock