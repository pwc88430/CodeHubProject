var express = require("express");
var router = express.Router();
var Helper = require("./other/Helper");
var { db } = require("../firebaseInit");

router.post("/", async (req, res) => {
    let { username, password, secretCode, startIndex, toIfExists } = req.body;
    let arr = [];
    let info = (
        await new Promise((resolve, reject) => {
            db.ref("/Posts/")
                .orderByChild("popularity")
                .once(
                    "value",
                    (data) => {
                        resolve(data);
                    },
                    (error) => {
                        reject(error);
                    }
                );
        })
    ).val();
    if (info == null) {
        res.send(Helper.Error("No data"));
        return;
    }

    let i = startIndex;
    let total = 0;
    var viewedPosts = await Helper.recieveFromDb(`Users/${username}/viewedPosts`);
    var keys = Object.keys(info);
    console.log(keys);
    keys.reverse();

    while (total < toIfExists - startIndex && i < toIfExists * 2) {
        if (i >= keys.length) break;
        if (!viewedPosts || !(keys[i] in viewedPosts)) {
            await Helper.uploadToDb(`Users/${username}/viewedPosts/${keys[i]}`, "");
            await Helper.uploadToDb(`Posts/${keys[i]}/popularity`, info[keys[i]].popularity - 10);
            await Helper.uploadToDb(`Posts/${keys[i]}/views`, info[keys[i]].views + 1);
            info[keys[i]].popularity -= 10;
            info[keys[i]].views++;
            arr.push({
                audioURL: await Helper.recieveFile(info[keys[i]].audioLocation + ".mp3"),
                postData: info[keys[i]],
                liked: false,
            });
            total++;
        }
        i++;
    }
    i = startIndex;
    if (arr.length < toIfExists - startIndex && viewedPosts) {
        while (i < toIfExists) {
            if (i >= keys.length) break;
            if (keys[i] in viewedPosts) {
                console.log(info[keys[i]]);
                arr.push({
                    audioURL: await Helper.recieveFile(info[keys[i]].audioLocation + ".mp3"),
                    postData: await Helper.recieveFromDb("/Posts/" + keys[i]),
                    liked: (await Helper.recieveFromDb("Users/" + username + "/likedPosts/" + keys[i])) !== null,
                });
                total++;
            }
            i++;
        }
    }
    res.send(arr);
});

module.exports = router;
