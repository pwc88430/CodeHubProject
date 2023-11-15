import { useState } from "react";
import Post from "../Post";
import { useEffect } from "react";

export default function MyFeedContainer({ userInfo }) {
    const [posts, setPosts] = useState([]);
    var [currentPosition, setCurrentPosition] = useState(0);

    useEffect(() => {
        loadPosts();
    }, []);

    function loadPosts() {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8000/explorePosts");
        xhr.setRequestHeader("Content-Type", "application/json");
        if (currentPosition == "") currentPosition = 0;
        const body = {
            username: userInfo.username,
            password: userInfo.password,
            secretKey: userInfo.secretKey,
            startIndex: parseInt(currentPosition),
            toIfExists: parseInt(currentPosition) + 10,
        };
        console.log(body);

        setCurrentPosition(parseInt(currentPosition) + 10);

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
            return <Post post={post} userInfo={userInfo} />;
        });
    }

    return (
        <div id="feedContainer">
            <div id="feed">{loadedPosts}</div>

            <div id="loadMoreAudio" onClick={loadPosts}></div>
        </div>
    );
}
