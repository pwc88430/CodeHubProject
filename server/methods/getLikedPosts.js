var express = require("express");
var router = express.Router();
var Helper = require("./other/Helper");

router.post("/", async (req, res) => {
    let { username, password, secretKey, targetUsername, startIndex, toIfExists } = req.body;
    if (username == null || password == null || secretKey == null || targetUsername == null || startIndex == null || toIfExists == null) {
        res.send(Helper.Error("Necessary parameters not given."));
        return;
    }

    if (!Helper.authorized(info.secretKey, info.username, info.password)) {
        res.send(Helper.Error("Not authorized."));
        return;
    }

    let data = await Helper.recieveFromDb("/Users/" + info.targetUsername + "/likedPosts/");
    if (data == null) {
        res.send([]);
        return;
    }

    if (info.toIfExists - info.startIndex > 150) {
        res.send(Helper.Error("The limit amount is 150 posts."));
    }

    let keys = Object.keys(data);
    let output = [];
    for (i = info.startIndex; i < Math.min(keys.length, info.toIfExists); i++) {
        let likedPost = await Helper.recieveFromDb("/Posts/" + keys[i]);
        output.push({
            audioURL: await Helper.recieveFile(likedPost.audioLocation + ".mp3"),
            postData: await Helper.recieveFromDb("/Posts/" + keys[i]),
        });
    }
    res.send(output);
    return;
});

module.exports = router;
