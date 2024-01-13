var express = require("express");
var router = express.Router();
var Helper = require("./other/Helper");
var { db } = require("../firebaseInit");

router.post("/", async (req, res) => {
    let info = req.body;
    // Checks if all needed variables were sent, and verifies username and password.
    if (
        !info.username ||
        !info.password ||
        !info.secretKey ||
        !info.postId ||
        !Helper.authorized(info.secretKey, info.username, info.password)
    ) {
        res.send(Helper.Error("Necessary parameters not given."));
        return;
    }

    let result = await Helper.recieveFromDb("/Posts/" + info.postId);
    if (result == null) {
        res.send(Helper.Error("Post does not exist."));
        return;
    }

    let userLikes = await Helper.recieveFromDb("/Users/" + info.username + "/likedPosts/" + info.postId);
    if (userLikes == null) {
        await Helper.uploadToDb("/Users/" + info.username + "/likedPosts/" + info.postId, "");
        await Helper.uploadToDb("/Posts/" + info.postId + "/likes", result.likes + 1);
        await Helper.uploadToDb("/Posts/" + info.postId + "/popularity", result.popularity + 50);
    } else {
        await db.ref("/Users/" + info.username + "/likedPosts/" + info.postId).remove();
        await Helper.uploadToDb("/Posts/" + info.postId + "/likes", result.likes - 1);
        await Helper.uploadToDb("/Posts/" + info.postId + "/popularity", result.popularity - 50);
    }

    console.log("liked post");

    res.send("Done");
});

module.exports = router;
