import { useState } from "react";
import Post from "../Post";
import { useEffect } from "react";

export default function MyFeedContainer({ userInfo }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        loadPosts();
    }, []);

    let startingIndex = 0;
    function loadPosts() {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8000/explorePosts");
        xhr.setRequestHeader("Content-Type", "application/json");

        const body = {
            username: userInfo.username,
            password: userInfo.password,
            secretKey: userInfo.secretKey,
            startIndex: startingIndex,
            toIfExists: startingIndex + 50,
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

    var loadedPosts = <div />;
    if (posts.length !== 0 && posts !== null) {
        loadedPosts = posts.map((post) => {
            console.log(post);
            return <Post post={post} />;
        });
    }

    return (
        <div id="feedContainer">
            <h3>Popular Posts</h3>
            <div id="feed">{loadedPosts}</div>
        </div>
    );
}
