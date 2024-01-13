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
        .once("value", async (val) => {
            val = val.val();
            console.log(val);
            let keys = Object.keys(val);
            console.log(keys);
            console.log(info.search);
            for (let i = 0; i < keys.length; i++) {
                console.log(val[keys[i]].title);
                if (val[keys[i]].title.toLowerCase().includes(info.search.toLowerCase())) {
                    console.log("found match" + val[keys[i]]);
                    arr.push(val[keys[i]]);
                }
            }
            res.send(arr);
        });
});

module.exports = router;
