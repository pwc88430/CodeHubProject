import React, { useEffect } from "react";

import HomePage from "./HomePage";
import { useState } from "react";
import LoginSignPage from "./loginSignPage";

function App() {
    const [screen, setScreen] = useState("loginSign");
    const [userInfo, setUserInfo] = useState({
        username: sessionStorage.getItem("voxUsername"),
        password: sessionStorage.getItem("voxPassword"),
        secretKey: sessionStorage.getItem("voxSecretKey"),
        secretKey: sessionStorage.getItem("voxDisplayName"),
        userIcon: sessionStorage.getItem("voxUserIcon"),
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
                const result = JSON.parse(xhr.response);
                console.log(result);
                if (result.type == "Error") {
                    if (handleError != null) {
                        handleError(result.error);
                    } // if
                } else {
                    console.log(result);
                    sessionStorage.setItem("voxUsername", result.username);
                    sessionStorage.setItem("voxPassword", result.password);
                    sessionStorage.setItem("voxSecretKey", result.secretKey);
                    sessionStorage.setItem("voxDisplayName", result.displayName);
                    sessionStorage.setItem("voxUserIcon", result.userIcon);
                    console.log(result.displayName);
                    setUserInfo({
                        username: result.username,
                        password: result.password,
                        secretKey: result.secretKey,
                        displayName: result.displayName,
                        userIcon: result.userIcon,
                    });

                    if (result.username != null) toHomePage();
                }
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
        sessionStorage.setItem("voxUserIcon", "");
        setUserInfo({
            username: "",
            password: "",
            secretKey: "",
            userIcon: "",
        });
        toLoginSignup();
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

    function toLoginSignup() {
        setScreen("loginSign");
    }

    function toSignUpForm() {
        setScreen("signUpPage");
    }

    if (screen === "homePage") {
        return <HomePage signOutUser={signOutUser} userInfo={userInfo} />;
    } else if (screen == "loginSign") {
        return (
            <>
                <LoginSignPage signInUser={signInUser} />
            </>
        );
    }
}

export default App;
