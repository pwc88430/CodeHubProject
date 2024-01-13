var express = require("express");
var router = express.Router();
var Helper = require("./other/Helper");

router.post("/", async (req, res) => {
    // TODO: test, comments
    let info = req.body;

    if (
        info.username &&
        info.password &&
        info.secretToken &&
        info.postId &&
        Helper.authorized(info.secretToken, info.username, info.password)
    ) {
        let post = Helper.recieveFromDb("/Posts/" + info.postId);
        let user = Helper.recieveFromDb("/Users/" + user + ":" + info.username);
        if (!user || !post || post.author != user.username) {
            res.send(null);
            return;
        }
        await db.remove("/Posts/" + user + ":" + info.postId);
        await db.remove("/Users/" + user + "/Posts/" + info.postId);
    }
    res.send(0);
});

module.exports = router;
