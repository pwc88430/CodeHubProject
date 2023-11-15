var express = require("express");
var router = express.Router();
var Helper = require("./other/Helper");
let { db } = require("../firebaseInit");

router.post("/", async (req, res) => {
    // TODO: limit amount sent back + check if this even works + filter by visibility
    let arr = [];
    let info = req.body;
    db.ref("/Posts/")
        .orderByChild("popularity")
        .once("value", (val) => {
            val = val.val();
            let keys = Object.keys(val);
            for (let i = 0; i < keys.length; i++) {
                if (val[keys[i]].title.toLowerCase().includes(info.search.toLowerCase())) {
                    arr.push(val[keys[i]]);
                }
            }
        });
    res.send(arr);
});

module.exports = router;
