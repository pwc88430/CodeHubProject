import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { useRef } from "react";

export default function LoginSignPage({ signInUser, error }) {
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

    function signIn(username, password) {
        signInUser(username, password, false);
    }

    return (
        <>
            <div className="tabs" onClick={changeTabs}>
                <div className="btn-container">
                    <button className="mainButton live" data-id="signup">
                        Sign Up
                    </button>
                    <button className="mainButton" data-id="login">
                        Login
                    </button>
                </div>
                <div className="tabs-content">
                    <div className="content live" id="signup">
                        <SignUpForm />
                    </div>
                    <div className="content" id="login">
                        <LoginForm signInUser={signIn} />
                    </div>
                </div>
            </div>
            <div className="error">Error</div>
        </>
    );
}
