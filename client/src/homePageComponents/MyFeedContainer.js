import { useState } from "react";
import Post from "../Post";
import { useEffect } from "react";

export default function MyFeedContainer({ userInfo, changeProfile }) {
    const [posts, setPosts] = useState([]);
    const [currentSearch, setSearch] = useState();

    useEffect(() => {
        sessionStorage.setItem("voxLoadUser", userInfo.username);
        setSearch(userInfo.username);
        loadPosts();
    }, []);

    function loadExplore(currentPosition) {
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

        document.getElementById("loadMoreAudio").setAttribute("pos", parseInt(currentPosition) + 10);

        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const newPosts = JSON.parse(xhr.response);
                console.log(newPosts);
                console.log(posts);
                setPosts([...posts, ...newPosts]);
            } else {
                console.log(`Error: ${xhr.status}`);
            }
        };
        xhr.send(JSON.stringify(body));
    }

    function loadUserPosts(currentPosition, request) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8000/getPosts");
        xhr.setRequestHeader("Content-Type", "application/json");
        if (currentPosition == "") currentPosition = 0;
        const body = {
            username: userInfo.username,
            password: userInfo.password,
            secretKey: userInfo.secretKey,
            startIndex: parseInt(currentPosition),
            toIfExists: parseInt(currentPosition) + 10,
            targetUsername: request,
        };

        document.getElementById("loadMoreAudio").setAttribute("pos", parseInt(currentPosition) + 10);

        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const newPosts = JSON.parse(xhr.response);
                setPosts([...posts, ...newPosts]);
            } else {
                console.log(`Error: ${xhr.status}`);
            }
        };
        xhr.send(JSON.stringify(body));
    }

    function loadPosts() {
        if (sessionStorage.getItem("voxLoadUser") != currentSearch && sessionStorage.getItem("voxLoadUser") != userInfo.username) {
            setSearch(sessionStorage.getItem("voxLoadUser"));
            changeLoad(sessionStorage.getItem("voxLoadUser"));
            return;
        }
        let request = document.getElementById("loadMoreAudio").getAttribute("request");
        let pos = document.getElementById("loadMoreAudio").getAttribute("pos");

        if (request == "") {
            loadExplore(pos);
        } else {
            loadUserPosts(pos, request);
        }
    }

    function changeLoad(req) {
        if (document.getElementById("loadMoreAudio").getAttribute("request") == req || req == null) return;

        setPosts([]);

        changeProfile(req == "" ? userInfo.username : req);

        document.getElementById("loadMoreAudio").setAttribute("request", req);
        document.getElementById("loadMoreAudio").setAttribute("pos", 0);
    }

    var loadedPosts = <div />;
    if (posts.length !== 0 && posts !== null) {
        loadedPosts = posts.map((post) => {
            return <Post post={post} userInfo={userInfo} />;
        });
    }

    return (
        <div id="feedContainer">
            <div id="feedButtons">
                <div onClick={() => changeLoad("")}>Explore</div>
                <p>|</p>
                <div onClick={() => changeLoad(currentSearch)}>Posts</div>
            </div>

            <div id="feed">{loadedPosts}</div>

            <div id="loadMoreAudio" pos={0} request={""} onClick={loadPosts}></div>
        </div>
    );
}
