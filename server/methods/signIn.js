var express = require("express");
var router = express.Router();
var Helper = require("./other/Helper");

router.post("/", async (req, res) => {
    // TODO: test
    console.log("sign in request received");
    let info = req.body;
    if (info.username && info.password && info.hashed != null) {
        let username = info.username;
        let password = info.hashed ? info.password : Helper.stringToHash(info.password);

        // get user data from db
        let data = await Helper.recieveFromDb(`/Users/${username}`);

        //checks if user exists
        if (data == null) {
            res.send(Helper.Error("User does not exist."));
            return;
        }

        // check if both hashed passwords are the same
        if (data.password === password) {
            // sends username, hashed password, and secret key for verification
            output = {
                username: username,
                password: password,
                secretKey: Helper.stringToHash(username + password),
                displayName: data.displayName,
                type: "Account Info",
            };

            res.send(output);
            return;
        } else {
            // otherwise dont allow
            res.send(Helper.Error("Incorrect password."));
            return;
        }
    }
    res.send(Helper.Error("Necessary inputs not given."));
});

module.exports = router;
