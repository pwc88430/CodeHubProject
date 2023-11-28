var express = require("express");
var router = express.Router();
var Helper = require("./other/Helper");

router.post("/", async (req, res) => {
    let { targetUsername } = req.body;

    // get user data from db
    let data = await Helper.recieveFromDb(`/Users/${targetUsername}`);

    //checks if user exists
    if (data == null) {
        res.send(Helper.Error("User does not exist."));
        return;
    }

    let output = {
        username: targetUsername,
        displayName: data.displayName,
        type: "Account Info",
        userIcon: data.userIcon,
    };

    res.send(output);
});

module.exports = router;
