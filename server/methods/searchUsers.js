var express = require("express");
var router = express.Router();
var Helper = require("./other/Helper");
var { db } = require("../firebaseInit");

router.post("/", async (req, res) => {
    // TODO: limit amount sent back + check if this even works + filter by visibility
    let usernames = [];
    let displaynames = [];
    let info = req.body;
    db.ref("/Users/").once("value", (val) => {
        val = val.val();
        let keys = Object.keys(val);
        for (let i = 0; i < keys.length; i++) {
            if (val[keys[i]].displayName.toLowerCase().includes(info.search.toLowerCase())) {
                usernames.push(val[keys[i]]);
                displaynames.push(val[keys[i]].displayName);
            }
        }
        res.send({ displayNames: displaynames, usernames: usernames });
    });
});

module.exports = router;
