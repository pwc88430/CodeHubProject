var express = require("express");
var router = express.Router();
var Helper = require("./other/Helper");

router.post("/", async (req, res) => {
    // TODO: check if this even works + finish the rest
    let arr = [];
    await db
        .ref("/Posts/")
        .orderByChild("popularity")
        .on("value", (val) => {
            console.log(val);
        });
    res.send(0);
});

module.exports = router;
