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

    if (info.follow) {
        let databaseResult = await Helper.uploadToDb("/Users/" + info.userData.username + "/following/" + info.userToFollow, "").catch(
            (err) => {
                console.log(err);
                return false;
            }
        );

        res.send(databaseResult);
    } else {
        let databaseResult = await Helper.removeFromDb("/Users/" + info.userData.username + "/following/" + info.userToFollow);
        res.send(databaseResult);
    }
});

module.exports = router;
