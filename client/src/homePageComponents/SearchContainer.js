import { useState } from "react";

import searchIcon from "../search.svg";

export default function SearchContainer({ toSearchView }) {
    const [enteredSearch, setEnteredSearch] = useState("");
    const [foundUsers, setFoundUsers] = useState([]);
    const [foundPosts, setFoundPosts] = useState([]);

    function updateText(event) {
        setEnteredSearch(event.target.value);

        if (event.key == "Enter") {
            search();
        }
    }

    let foundUsersList;
    let foundPostsList;

    // if (foundUsers.length != 0) {
    //     foundUsersList = foundUsers.map((user) => <li>{user.name}</li>);
    // }
    // if (foundPosts.length != 0) {
    //     foundPostsList = foundPosts.map((post) => <li>{post.title}</li>);
    // }

    function search() {
        console.log("searched");
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8000/searchPosts");
        xhr.setRequestHeader("Content-Type", "application/json");

        const body = {
            type: "search",
            search: enteredSearch,
        };

        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                setFoundPosts(xhr.response); /// will need to format response first
                console.log(xhr.response);
            } else {
                console.log(`Error: ${xhr.status}`);
            }
        };
        xhr.send(JSON.stringify(body));

        const xhr2 = new XMLHttpRequest();
        xhr2.open("POST", "http://localhost:8000/searchUsers");
        xhr2.setRequestHeader("Content-Type", "application/json");

        const body2 = {
            type: "search",
            search: enteredSearch,
        };

        xhr2.onload = () => {
            if (xhr2.readyState === 4 && xhr2.status === 200) {
                setFoundUsers(xhr.response); // will need to format response first
                console.log(xhr2.response);
            } else {
                console.log(`Error: ${xhr2.status}`);
            }
        };
        xhr2.send(JSON.stringify(body));
    } // search

    return (
        <div id="searchContainer">
            <input id="search" placeholder="Search" maxLength={20} onKeyDown={updateText}></input>

            <img id="searchIcon" src={searchIcon} alt="search image"></img>

            {foundUsersList && foundUsers.length != 0}
            {/* <button onClick={search} className="button">
                Search
            </button> */}
            {/* <div id="userSearch">
                Users
                <ul>{foundUsersList}</ul>
            </div>
            <div id="postSearch">
                Posts
                <ul>{foundPostsList}</ul>
            </div> */}
        </div>
    );
}
