import React, { useEffect } from "react";
import LoginForm from "./LoginForm";
import "./LoginForm.css";
import RecordingPage from "./RecordingPage";
import "./RecordingPage.css";
import HomePage from "./HomePage";
import { useState } from "react";
import SignUpForm from "./SignUpForm";
import LoginSignPage from "./loginSignPage";

function App() {
    const [screen, setScreen] = useState("signUpPage");
    const [userInfo, setUserInfo] = useState({
        username: sessionStorage.getItem("voxUsername"),
        password: sessionStorage.getItem("voxPassword"),
        secretKey: sessionStorage.getItem("voxSecretKey"),
    });

    useEffect(() => {
        console.log(userInfo);
        if (userInfo.username != null && userInfo.password != null && userInfo.secretKey != null) {
            signInUser(userInfo.username, userInfo.password);
        }
    }, []);

    function signInUser(username, password) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8000/signIn");
        xhr.setRequestHeader("Content-Type", "application/json");

        const body = {
            username: username,
            password: password,
        };

        console.log("username: " + username + "  password:" + password);

        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (xhr.response == "") return;
                console.log(xhr.response);
                const result = JSON.parse(xhr.response);
                sessionStorage.setItem("voxUsername", result.username);
                sessionStorage.setItem("voxPassword", result.password);
                sessionStorage.setItem("voxSecretKey", result.secretKey);
                toHomePage();
            } else {
                console.log(`Error: ${xhr.status}`);
            }
        };
        xhr.send(JSON.stringify(body));
    }

    function toRecordingPage() {
        setScreen("recordingPage");
    }
    function toHomePage() {
        setScreen("homePage");
    }
    function toMainPage() {
        setScreen("main");
    }

    function toSignUpForm() {
        setScreen("signUpPage");
    }

    if (screen === "main") {
        return (
            <div className="App">
                <LoginForm changeScreen={toRecordingPage} toHomePage={toMainPage} toSignUpForm={toSignUpForm} signInUser={signInUser} />
            </div>
        );
    } else if (screen === "recordingPage") {
        return <RecordingPage changeScreen={toMainPage} />;
    } else if (screen === "homePage") {
        return <HomePage />;
    } else if (screen === "signUpPage") {
        return <SignUpForm changeScreen={toMainPage} />;
    } else if (sceen == "loginSign") {
        return <LoginSignPage />;
    }
}

export default App;
