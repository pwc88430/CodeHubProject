var express = require("express");
var router = express.Router();
var Helper = require("./other/Helper");
var { db } = require("../firebaseInit");

router.post("/", async (req, res) => {
    // TODO: limit amount sent back + check if this even works + filter by visibility
    let arr = [];
    let info = req.body;
    db.ref("/Users/").once("value", (val) => {
        console.log(val);
        if (val.title.includes(info.search)) {
            arr.push(val);
        }
    });
    res.send(arr);
});

module.exports = router;
