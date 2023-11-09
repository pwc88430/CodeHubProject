var express = require("express");
var router = express.Router();
var Helper = require("./other/Helper");
var { db } = require("../firebaseInit");

router.post("/", async (req, res) => {
    let { username, password, secretCode } = req.body;
    let arr = [];
    let info = (await db.ref("/Posts/").orderByChild("popularity").once("value")).val();
    let i = 0;
    let total = 0;
    var viewedPosts = await Helper.recieveFromDb(`Users/${username}/viewedPosts`);
    var keys = Object.keys(info);
    while (total < 50 && i < 200) {
        if (i >= keys.length) break;
        if (!viewedPosts || !(keys[i] in viewedPosts)) {
            await Helper.uploadToDb(`Users/${username}/viewedPosts/${keys[i]}`, "");
            await Helper.uploadToDb(`Posts/${keys[i]}`, { popularity: info[keys[i]].popularity - 10, views: info[keys[i]].views + 1 });
            info[keys[i]].popularity -= 10;
            info[keys[i]].views++;
            arr.push({
                audioURL: await Helper.recieveFile(info[keys[i]].audioLocation + ".mp3"),
                postData: info[keys[i]],
            });
            total++;
        }
        i++;
    }
    i = 0;
    if (arr.length < 50) {
        while (i < 50) {
            if (i >= keys.length) break;
            if (keys[i] in viewedPosts) {
                arr.push({
                    audioURL: await Helper.recieveFile(info[keys[i]].audioLocation + ".mp3"),
                    postData: await Helper.recieveFromDb("/Posts/" + keys[i]),
                });
                total++;
            }
            i++;
        }
    }
    res.send(arr);
});

module.exports = router;
