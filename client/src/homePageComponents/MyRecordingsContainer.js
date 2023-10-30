export default function MyRecordingsContainer({ toMyRecordingsView }) {
    return (
        <div onClick={toMyRecordingsView} id="myRecordingsContainer">
            <h3>My Recordings</h3>
            <hr></hr>
        </div>
    );
}
