var express = require("express");
var router = express.Router();
var Helper = require("./other/Helper");

router.post("/", async (req, res) => {
    let info = req.body;

    let databaseResult = await Helper.uploadToDb("/Users/" + info.username + "/displayName/", info.newUsername);
    let databaseResult2 = await Helper.uploadToDb("/Users/" + info.username + "/userIcon/", info.newUserIcon);

    console.log(databaseResult && databaseResult2);
});

module.exports = router;
