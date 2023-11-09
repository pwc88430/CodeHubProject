import logo from "./icon.svg";

export default function SignUpForm({ setErrorMessage }) {
    function logResult(result) {
        console.log(result);
    }
    function signUpUser() {
        const displayNameEl = document.querySelector("#displayName");
        const passwordEl = document.querySelector("#signupPassword");
        const userNameEl = document.querySelector("#signupUsername");

        if (userNameEl.value == "") {
            setErrorMessage("Please enter a username");
        } else if (passwordEl.value == "") {
            setErrorMessage("Please enter a password");
        } else if (displayNameEl.value == "") {
            setErrorMessage("Please enter a display name");
        } else {
            const body = {
                username: userNameEl.value,
                password: passwordEl.value,
                displayName: displayNameEl.value,
            };

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:8000/signUp");
            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.onload = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const result = JSON.parse(xhr.response);
                    if (result.type == "Error") {
                        setErrorMessage(result.error);
                    } else {
                        setErrorMessage("Account Created!");
                    }
                } else {
                    console.log(`Error: ${xhr.status}`);
                }
            };
            xhr.send(JSON.stringify(body));
            setErrorMessage("");
        } // else
    }

    return (
        <>
            <h2>Sign Up</h2>
            <div>
                <input placeholder="Username" id="signupUsername"></input>
            </div>
            <div>
                <input placeholder="Password" id="signupPassword"></input>
            </div>

            <div>
                <input placeholder="Display Name" id="displayName"></input>
            </div>

            <button className="button" onClick={signUpUser}>
                Create Account
            </button>
        </>
    );
}
