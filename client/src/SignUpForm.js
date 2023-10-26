export default function SignUpForm() {
    function logResult(result) {
        console.log(result);
    }
    function signUpUser() {
        const displayNameEl = document.querySelector("#displayName");
        const passwordEl = document.querySelector("#signupPassword");
        const userNameEl = document.querySelector("#signupUsername");

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
                logResult(xhr.responseText);
                logResult(xhr.response);
                console.log(JSON.parse(xhr.response));
            } else {
                console.log(`Error: ${xhr.status}`);
            }
        };
        xhr.send(JSON.stringify(body));
    }

    return (
        <>
            <h2>Sign Up</h2>
            <div>
                <label>Username:</label>
                <input id="signupUsername"></input>
            </div>
            <div>
                <label>Password:</label>
                <input id="signupPassword"></input>
            </div>

            <div>
                <label>Display Name:</label>
                <input id="displayName"></input>
            </div>

            <button className="button" onClick={signUpUser}>
                Create Account
            </button>
        </>
    );
}
