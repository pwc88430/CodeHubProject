import { useState } from "react";
import Post from "../Post";
import { useEffect } from "react";

export default function MyRecordingsContainer({ toMyRecordingsView, userInfo }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        loadPosts();
    }, []);

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
                const newPosts = JSON.parse(xhr.response);
                console.log(newPosts);
                setPosts([...posts, ...newPosts]);
            } else {
                console.log(`Error: ${xhr.status}`);
            }
        };
        xhr.send(JSON.stringify(body));
    }

    const loadedPosts = posts.map((post) => {
        return post.postData !== null ? <Post post={post} /> : <div />;
    });

    return (
        <div onClick={toMyRecordingsView} id="myRecordingsContainer">
            <h3>My Posts</h3>
            <hr></hr>
            <div id="post-container">{loadedPosts}</div>
        </div>
    );
}
