var express = require("express");
var router = express.Router();
var Helper = require("./other/Helper");

router.post("/", async (req, res) => {
    // TODO: test, comments

    let info = req.body;
    if (
        info.username != null &&
        info.password != null &&
        info.targetUsername != null &&
        info.secretKey != null &&
        info.startIndex != null &&
        info.toIfExists != null
    ) {
        if (!Helper.authorized(info.secretKey, info.username, info.password)) {
            res.send(null);
            return;
        }
        let data = await Helper.recieveFromDb("/Users/" + info.targetUsername + "/Posts/");
        console.log("DATA:");
        console.log(data);

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
            output.push({
                postData: await Helper.recieveFromDb("/Posts/" + info.targetUsername + ":" + keys[i]),
                audioURL: await Helper.recieveFile(data[keys[i]].audioLocation + ".mp3"),
            });
        }
        return;
    }
    res.send(Helper.Error("Necessary parameters not given."));
});

module.exports = router;
