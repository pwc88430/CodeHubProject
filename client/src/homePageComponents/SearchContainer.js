import { useState } from "react";

export default function SearchContainer({ toSearchView }) {
    const [enteredSearch, setEnteredSearch] = useState("");
    const [foundUsers, setFoundUsers] = useState([]);
    const [foundPosts, setFoundPosts] = useState([]);

    function updateText(event) {
        // setEnteredSearch(event.target.value);
    }

    const foundUsersList = foundUsers.map((user) => <li>{user.name}</li>);
    const foundPostsList = foundPosts.map((post) => <li>{post.title}</li>);

    function search() {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8000/searchPosts");
        xhr.setRequestHeader("Content-Type", "application/json");

        const body = {
            type: "search",
            search: enteredSearch,
        };
        console.log(body);

        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                setFoundPosts(xhr.response); /// will need to format response first
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
        console.log(body);

        xhr2.onload = () => {
            if (xhr2.readyState === 4 && xhr2.status === 200) {
                setFoundUsers(xhr.response); // will need to format response first
            } else {
                console.log(`Error: ${xhr2.status}`);
            }
        };
        xhr2.send(JSON.stringify(body));
    } // search

    return (
        <div onClick={toSearchView} id="searchContainer">
            <input id="search" placeholder="Search" maxLength={20} onKeyDown={updateText}></input>
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
