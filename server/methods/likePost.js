var express = require("express");
var router = express.Router();
var Helper = require("./other/Helper");

router.post("/", async (req, res) => {
    let info = req.body;
    // Checks if all needed variables were sent, and verifies username and password.
    if (
        !info.username ||
        !info.password ||
        !info.secretToken ||
        !info.postId ||
        !Helper.authorized(info.secretToken, info.username, info.password)
    ) {
        res.send(null);
        return;
    }

    let result = await Helper.recieveFromDb("/Posts/" + info.postId);
    if (result == null) {
        res.send(null);
        return;
    }

    // TODO: NEED TO CHECK IF USER HAS ALREADY LIKED POST, UNLIKE IF THEY HAVE

    let output = await Helper.uploadToDb("/Posts/" + info.postId + "/likes", result.likes + 1);
    res.send(0);
});

module.exports = router;
