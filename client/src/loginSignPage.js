import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { useState } from "react";
import ErrorBox from "./ErrorBox";
import "./LoginSignPage.css";

import logo from "./icon.svg";

export default function LoginSignPage({ signInUser }) {
    const [error, setError] = useState("");

    function setErrorMessage(newError) {
        setError(newError);
    }

    function toSignUpPage() {
        const btnEl = document.querySelector("#sign-up-tab-button");
        btnEl.click();
        setError("");
    }

    function changeTabs(event) {
        const btns = document.querySelectorAll(".mainButton");
        const articles = document.querySelectorAll(".content");

        const id = event.target.dataset.id;

        if (id) {
            btns.forEach((btn) => {
                btn.classList.remove("live");
            });
            event.target.classList.add("live");

            articles.forEach((article) => {
                article.classList.remove("live");
            });
            const element = document.getElementById(id);
            element.classList.add("live");
        }
    }

    function signIn(username, password, hashed, handleError) {
        signInUser(username, password, false, handleError);
    }

    return (
        <>
            <header className="page-header">
                <img src={logo} alt="logo" className="logo" />
            </header>
            <div className="tabs" onClick={changeTabs}>
                <div className="btn-container" onClick={() => setError("")}>
                    <button id="sign-up-tab-button" className="mainButton live" data-id="signup">
                        Sign Up
                    </button>
                    <button className="mainButton" data-id="login">
                        Login
                    </button>
                </div>
                <div className="tabs-content">
                    <div className="content live" id="signup">
                        <SignUpForm setErrorMessage={setErrorMessage} />
                    </div>
                    <div className="content" id="login">
                        <LoginForm signInUser={signIn} setErrorMessage={setErrorMessage} toSignUpPage={toSignUpPage} />
                    </div>
                </div>
            </div>
            <ErrorBox error={error} />
        </div>
    );
}
