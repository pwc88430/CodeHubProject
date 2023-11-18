import { useState } from "react";

import searchIcon from "../search.svg";

export default function SearchContainer({ toSearchView }) {
    const [results, setResults] = useState([]);

    const searchResults = results.map((result, index) => {
        if (result == "Users") {
            return <h3 key={index}>{result}</h3>;
        } else if (result == "Posts") {
            return <h3 key={index}>{result}</h3>;
        } else {
            return (
                <li key={index}>
                    {result}
                    <button>Follow</button>
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
