import React, { useState } from "react";

function LoginForm({ changeScreen, toHomePage, toSignUpForm, signInUser }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    //const handleSubmit = (e) => {
    //  e.preventDefault();
    // toHomePage();
    // };

    const userNameEl = document.querySelector("#username");
    const passwordEl = document.querySelector("#password");

    function signIn() {
        signInUser(userNameEl.value, passwordEl.value, false);
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
                <button className="button" type="submit" onClick={signIn}>
                    Log in
                </button>
            </div>

            <button className="button" onClick={toSignUpForm}>
                Don't have an account? Sign up!
            </button>
        </div>
    );
}

export default LoginForm;
