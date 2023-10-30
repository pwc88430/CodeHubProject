import { useState } from "react";

export default function MyRecordingsContainer({ toMyRecordingsView, userInfo }) {
    const [posts, setPosts] = useState([]);
    function loadPosts() {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8000/getPosts");
        xhr.setRequestHeader("Content-Type", "application/json");

        const body = {
            username: userInfo.username,
            password: userInfo.password,
            secretKey: userInfo.secretKey,
        };
        console.log(body.username + " " + body.password + " " + body.secretKey);

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
