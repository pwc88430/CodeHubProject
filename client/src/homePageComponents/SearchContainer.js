import { useState, useEffect } from "react";

import searchIcon from "../search.svg";

export default function SearchContainer({ userInfo }) {
    const [results, setResults] = useState([]);
    const [followingList, setFollowingList] = useState([]);

    function follow(user) {
        const xhr3 = new XMLHttpRequest();
        xhr3.open("POST", "http://localhost:8000/followUser");
        xhr3.setRequestHeader("Content-Type", "application/json");

        const body = {
            userData: {
                username: userInfo.username,
                displayName: userInfo.displayName,
                password: userInfo.password,
                userIcon: userInfo.userIcon,
            },
            secretKey: userInfo.secretKey,
            userToFollow: user,
        };

        xhr3.onload = () => {
            if (xhr3.readyState === 4 && xhr3.status === 200) {
                if (JSON.parse(xhr3.response).length == 0) {
                } else {
                }
            } else {
                console.log(`Error: ${xhr3.status}`);
            }
        };
        xhr3.send(JSON.stringify(body));
    }

    function getUserData() {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8000/getExtraUserData");
        xhr.setRequestHeader("Content-Type", "application/json");

        const body = {
            username: userInfo.username,
            password: userInfo.password,
            secretKey: userInfo.secretKey,
            targetUser: userInfo.username,
        };

        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let following = JSON.parse(xhr.response);
                console.log(following.following);
                setFollowingList(following.following);
                console.log(followingList);
            } else {
                console.log(`Error: ${xhr.status}`);
            }
        };
        xhr.send(JSON.stringify(body));
    }

    useEffect(() => {
        getUserData();
    }, []);

    const searchResults = results.map((result, index) => {
        if (result == "Users") {
            return <h3 key={index}>{result}</h3>;
        } else if (result == "Posts") {
            return <h3 key={index}>{result}</h3>;
        } else if (result == "No Posts found" || result == "No Users Found") {
            return <h5 key={index}>{result}</h5>;
        } else {
            return (
                <li key={index}>
                    {result}
                    <button onClick={() => follow(result)}>Follow</button>
                </li>
            );
        }
    });

    function search(event) {
        if (event.target.value == "") {
            setResults([]);
            const resultsEl = document.querySelector("#results_container");
            resultsEl.classList.remove("open");
        } else {
            let newResults;
            const resultsEl = document.querySelector("#results_container");
            resultsEl.classList.add("open");

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:8000/searchPosts");
            xhr.setRequestHeader("Content-Type", "application/json");

            const body = {
                type: "search",
                search: event.target.value,
            };

            xhr.onload = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    if (JSON.parse(xhr.response).length == 0) {
                        newResults = ["No Posts found"];
                    } else {
                        newResults = [...JSON.parse(xhr.response)];
                        newResults = newResults.map((post) => post.title);
                    }

                    const xhr2 = new XMLHttpRequest();
                    xhr2.open("POST", "http://localhost:8000/searchUsers");
                    xhr2.setRequestHeader("Content-Type", "application/json");

                    const body2 = {
                        type: "search",
                        search: event.target.value,
                    };

                    xhr2.onload = () => {
                        if (xhr2.readyState === 4 && xhr2.status === 200) {
                            if (JSON.parse(xhr2.response).length == 0) {
                                newResults = ["Users", "No Users Found", "Posts", ...newResults];
                            } else {
                                newResults = ["Users", ...JSON.parse(xhr2.response), "Posts", ...newResults];
                            }
                            setResults(newResults);
                        } else {
                            console.log(`Error: ${xhr2.status}`);
                        }
                    };
                    xhr2.send(JSON.stringify(body));
                } else {
                    console.log(`Error: ${xhr.status}`);
                }
            };
            xhr.send(JSON.stringify(body));
        }
    } // search

    return (
        <div id="searchContainer">
            <input id="search" placeholder="Search" maxLength={20} onKeyDown={search}></input>

            <img id="searchIcon" src={searchIcon} alt="search image"></img>

            <div id="results_container">{searchResults}</div>
        </div>
    );
}
