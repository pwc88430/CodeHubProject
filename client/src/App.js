import React, { useEffect } from "react";
import LoginForm from "./LoginForm";
import "./LoginForm.css";
import RecordingPage from "./RecordingPage";
import "./RecordingPage.css";
import HomePage from "./HomePage";
import { useState } from "react";
import SignUpForm from "./SignUpForm";
import LoginSignPage from "./loginSignPage";
import "./LoginSignPage.css";

function App() {
    const [screen, setScreen] = useState("loginSign");
    const [userInfo, setUserInfo] = useState({
        username: sessionStorage.getItem("voxUsername"),
        password: sessionStorage.getItem("voxPassword"),
        secretKey: sessionStorage.getItem("voxSecretKey"),
        secretKey: sessionStorage.getItem("voxDisplayName"),
    });
    const [error, setError] = useState("");

    useEffect(() => {
        if (userInfo.username != null && userInfo.password != null && userInfo.secretKey != null) {
            signInUser(userInfo.username, userInfo.password, true);
        }
    }, []);

    function signInUser(username, password, hashed, handleError) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8000/signIn");
        xhr.setRequestHeader("Content-Type", "application/json");

        const body = {
            username: username,
            password: password,
            hashed: hashed,
        };

        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (xhr.response.type == "Error") console.log("error");
                if (xhr.response == "") return;

                const result = JSON.parse(xhr.response);
                console.log(result);
                sessionStorage.setItem("voxUsername", result.username);
                sessionStorage.setItem("voxPassword", result.password);
                sessionStorage.setItem("voxSecretKey", result.secretKey);
                sessionStorage.setItem("voxDisplayName", result.displayName);
                console.log(result.displayName);
                setUserInfo({
                    username: result.username,
                    password: result.password,
                    secretKey: result.secretKey,
                    displayName: result.displayName,
                });

                if (result.username != null) toHomePage();
            } else {
                //console.log(`Error: ${xhr.status}`);
            }
        };
        xhr.send(JSON.stringify(body));
    }

    function signOutUser() {
        sessionStorage.setItem("voxUsername", "");
        sessionStorage.setItem("voxPassword", "");
        sessionStorage.setItem("voxSecretKey", "");
        setUserInfo({
            username: "",
            password: "",
            secretKey: "",
        });
        toMainPage();
        console.log(userInfo);
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

    if (screen === "recordingPage") {
        return <RecordingPage changeScreen={toMainPage} />;
    } else if (screen === "homePage") {
        return <HomePage signOutUser={signOutUser} userInfo={userInfo} />;
    } else if (screen == "loginSign") {
        return <LoginSignPage signInUser={signInUser} />;
    }
}

export default App;
