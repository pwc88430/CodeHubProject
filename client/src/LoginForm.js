import React, { useState } from "react";
import "./LoginSignPage.css";

function LoginForm({ changeScreen, toHomePage, signInUser, setErrorMessage, toSignUpPage }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    //const handleSubmit = (e) => {
    //  e.preventDefault();
    // toHomePage();
    // };

    const userNameEl = document.querySelector("#username");
    const passwordEl = document.querySelector("#password");

    function signIn() {
        console.log(userNameEl.value);
        console.log(passwordEl.value);
        if (userNameEl.value == "") {
            console.log("no username");
            setErrorMessage("Please enter a username");
        } else if (passwordEl.value == "") {
            console.log("no password");
            setErrorMessage("Please enter a password");
        } else {
            setErrorMessage("");
            signInUser(userNameEl.value, passwordEl.value, false, setErrorMessage);
        }
    }
    return (
        <div>
            <h2>Login</h2>
            <div id="form">
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button id="loginButton" className="button" type="submit" onClick={signIn}>
                    Log in
                </button>
            </div>

            <button className="button" onClick={toSignUpPage}>
                Don't have an account? Sign up!
            </button>
        </div>
    );
}

export default LoginForm;
