var express = require("express");
var router = express.Router();
var Helper = require("./other/Helper");

router.post("/", async (req, res) => {
    let info = req.body;
    console.log(info);

    if (!Helper.authorized(info.secretKey, info.userData.username, info.userData.password)) {
        res.send(false);
        console.log("not authorized");
        console.log(info.secretKey + " " + info.userData.username + " " + info.userData.password);
        return;
    }

    let databaseResult = await Helper.uploadToDb("/Users/" + info.userData.username + "/followers/" + info.userToFollow, "").catch(
        (err) => {
            console.log(err);
            return false;
        }
    );

    res.send(databaseResult);
});

module.exports = router;
