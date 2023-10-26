var express = require("express");
var router = express.Router();
var Helper = require("./other/Helper");

router.post("/", async (req, res) => {
    // TODO: test, comments

    let info = req.body;
    if (info.username && info.password && info.secretKey) {
        if (!Helper.authorized(info.secretKey, info.username, info.password)) {
            res.send(null);
            return;
        }
        let data = await Helper.recieveFromDb("/Users/" + username + "/Posts/");
        let output = [];
        for (i = 0; i < Math.max(data.length, 50); i++) {
            output.push({
                postData: await Helper.recieveFromDb("/Posts/" + data[i]),
                audioURL: await Helper.recieveFile("audioFiles/" + username + "/" + data[i] + ".mp3"),
            });
            console.log(output[i]);
        }
        res.send(output);
        return;
    }
    res.send(null);
});

module.exports = router;
