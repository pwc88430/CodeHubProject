import { useState } from "react";

export default function MyRecordingsContainer({ toMyRecordingsView, userInfo }) {
    const [posts, setPosts] = useState([]);
    let startingIndex = 0;
    function loadPosts() {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8000/getPosts");
        xhr.setRequestHeader("Content-Type", "application/json");

        const body = {
            username: userInfo.username,
            password: userInfo.password,
            secretKey: userInfo.secretKey,
            startIndex: startingIndex,
            toIfExists: startingIndex + 50,
            targetUsername: userInfo.username,
        };
        console.log(body);

        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(JSON.parse(xhr.response));
            } else {
                console.log(`Error: ${xhr.status}`);
            }
        };
        xhr.send(JSON.stringify(body));
    }

    loadPosts();

    return (
        <div onClick={toMyRecordingsView} id="myRecordingsContainer">
            <h3>My Posts</h3>
            <hr></hr>
        </div>
    );
}
