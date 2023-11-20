var express = require("express");
var router = express.Router();
var Helper = require("./other/Helper");

router.post("/", async (req, res) => {
    const { username, password, secretKey, targetUser } = req.body;

    let userInfo = await Helper.recieveFromDb("Users/" + targetUser + "/Posts");

    let output = {
        posts: 0,
        likes: 0,
        views: 0,
        following: null,
        icon: null,
    };

    if (userInfo == null) {
        res.send(output);
        return;
    }

    let keys = Object.keys(userInfo);

    output.posts = keys.length;

    let likes = 0;
    let views = 0;
    for (let i = 0; i < keys.length; i++) {
        likes += await Helper.recieveFromDb("Posts/" + targetUser + ":" + keys[i] + "/likes");
        views += await Helper.recieveFromDb("Posts/" + targetUser + ":" + keys[i] + "/views");
    }

    let following = await Helper.recieveFromDb("Users/" + targetUser + "/following/");

    let keys2 = [];
    if (following !== null) keys2 = Object.keys(following);

    output.likes = likes;
    output.views = views;
    output.following = keys2;
    let icon = await Helper.recieveFromDb("Users/" + targetUser + "/userIcon");

    output.icon = icon;
    console.log(`sending extra data: \n Likes: ${output.likes} \n Views: ${output.views} \n Posts: ${output.posts}`);

    res.send(output);
});

module.exports = router;
