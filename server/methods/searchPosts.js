var express = require("express");
var router = express.Router();
var Helper = require("./other/Helper");
let { db } = require("../firebaseInit");

router.post("/", async (req, res) => {
    // TODO: limit amount sent back + check if this even works + filter by visibility
    let arr = [];
    let info = req.body;
    await db
        .ref("/Posts/")
        .orderByChild("popularity")
        .on("value", (val) => {
            console.log(val);
            if (val.title.includes(info.search)) {
                arr.push(val);
            }
        });
    res.send(arr);
});

module.exports = router;
