export default function LoginSignPage() {
    return (
        <div class="tabs">
            <div class="btn-container">
                <button class="button live" data-id="signUp">
                    Sign Up
                </button>
                <button class="button" data-id="login">
                    Login
                </button>
            </div>
            <div class="tabs-content">
                <div class="content live" id="signUp">
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
                </div>
                <div class="content" id="login">
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" onClick={signIn}>
                        Log in
                    </button>
                </div>
            </div>
        </div>
    );
}
