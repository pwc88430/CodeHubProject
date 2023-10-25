export default function SignUpForm({ changeScreen }) {
    function logResult(result) {
        console.log(result);
    }
    function signUpUser() {
        const displayNameEl = document.querySelector("#displayName");
        const passwordEl = document.querySelector("#password");
        const userNameEl = document.querySelector("#username");

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
            <div>
                <label>Display Name</label>
                <input id="displayName"></input>
            </div>
            <div>
                <label>Password</label>
                <input id="password"></input>
            </div>
            <div>
                <label>User Name</label>
                <input id="username"></input>
            </div>
            <button onClick={signUpUser}>Create Account</button>
            <button className="button" id="back" onClick={changeScreen}>
                Back
            </button>
        </>
    );
}
