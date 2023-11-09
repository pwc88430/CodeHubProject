var express = require("express");
var router = express.Router();
var Helper = require("./other/Helper");

router.post("/", async (req, res) => {
    // TODO: test, make sure needed variables are sent
    let info = req.body;
    console.log("Request recieved");

    if (!Helper.authorized(info.secretKey, info.userData.username, info.userData.password)) {
        res.send(false);
        console.log("not authorized");
        console.log(info.secretKey + " " + info.userData.username + " " + info.userData.password);
        return;
    }

    const currentTime = new Date().getTime();

    let post = {
        likes: 0,
        views: 1,
        title: info.postTitle,
        audioLocation: `audioFiles/${info.userData.username}/${currentTime}`,
        popularity: 100,
        lastInteraction: 0,
        dateCreated: currentTime,
        author: info.userData.username,
        authorName: info.userData.displayName,
        visibility: info.visibility,
        edited: false,
        description: info.description,
        duration: info.duration,
    };

    let storageResult = await Helper.uploadFile(info.audioChunks, info.userData.username, currentTime).catch((err) => {
        console.log(err);
        return false;
    });
    console.log(storageResult);

    let databaseResult = await Helper.uploadToDb("/Users/" + info.userData.username + "/Posts/" + currentTime, post).catch((err) => {
        console.log(err);
        return false;
    });
    console.log(databaseResult);

    let databaseResult2 = await Helper.uploadToDb("/Posts/" + info.userData.username + ":" + currentTime, post).catch((err) => {
        console.log(err);
        return false;
    });
    console.log(databaseResult2);

    res.send(storageResult && databaseResult && databaseResult2);
});

module.exports = router;
