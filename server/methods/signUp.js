var express = require("express");
var router = express.Router();
var Helper = require("./other/Helper");

router.post("/", async (req, res) => {
    let info = req.body;

    if (!info.username || !info.password || !info.displayName) {
        console.error("Necessary parameters not given. (/signUp)");
        res.send(null);
        return;
    }

    let username = info.username;
    let password = Helper.stringToHash(info.password);
    let displayName = info.displayName;

    // check if username contains / or \ (this will mess up database if it does)
    if (username.includes("/") || username.includes("\\")) {
        res.send(Helper.Error("Do not include / or \\ in username."));
        return;
    }
    // check if username exists
    let userExists = await Helper.recieveFromDb(`/Users/${username}`);
    console.log(userExists);
    if (userExists != null) {
        res.send(Helper.Error("Account already exists."));
        return;
    }
    // otherwise upload signup data to database and create account
    let result = await Helper.uploadToDb(`/Users/${username}`, {
        password: password,
        displayName: displayName,
        dateCreated: new Date().getTime(),
        userIcon: "default",
    });

    // if account creation is unsuccessful, return error
    if (!result) {
        res.send(Helper.Error("Account creation unsuccessful."));
        return;
    }

    // otherwise when successful, sends username, hashed password, and secret key for verification
    let output = {
        username: username,
        password: password,
        secretKey: Helper.stringToHash(username + password),
        displayName: displayName,
    };

    res.send(JSON.stringify(output));
});

module.exports = router;
