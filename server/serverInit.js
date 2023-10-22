const { db, bucket } = require("./firebaseInit");
var express = require("express");
var app = express();
app.use(express.json());
const { ref, set, get, child, remove } = require("firebase-admin/database");
const FirebaseStorage = require("./FirebaseStorage");
var cors = require("cors");

app.use(
    cors({
        allowedHeaders: ["Content-Type"],
        exposedHeaders: ["Content-Type"],
        origin: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: true,
    })
);

// ! should change every method to its own script and also make a helper class

app.get("/", (req, res) => {
    res.send("Server online");
});

// createPost
// secretToken, userData: {username, displayName}, postTitle, audioChunks, visibility
// creates post
// returns if post is allowed to upload
app.post("/createPost", async (req, res) => {
    // TODO: test, comments, authorize, make sure needed variables are sent
    let info = req.body;
    console.log("request recieved");

    // no verification yet

    const currentTime = new Date().getTime();

    let post = {
        likes: 0,
        views: 1,
        title: info.postTitle,
        audioLocation: `audioFiles/${info.userData.username}/${currentTime}`,
        popularity: 100,
        lastInteraction: 0,
        dateCreated: currentTime,
        author: info.userData.username,
        authorName: info.userData.displayName,
        visibility: info.visibility,
    };

    let storageResult = await uploadFile(info.audioChunks, info.userData.username).catch((err) => {
        return false;
    });
    console.log(storageResult);

    let databaseResult = await uploadToDb("Users/" + info.userData.username + "/Posts/" + currentTime, post).catch((err) => {
        return false;
    });
    console.log(databaseResult);

    let databaseResult2 = await uploadToDb("Posts/" + info.userData.username + ":" + currentTime, post).catch((err) => {
        return false;
    });
    console.log(databaseResult2);

    res.send(storageResult && databaseResult && databaseResult2);
});

// deletePost
// secretToken, username, password, postId
// deletes users post
// returns if deleted
app.post("/deletePost", async (req, res) => {
    // TODO: test, comments
    let info = req.body;

    if (info.username && info.password && info.secretToken && info.postId && authorized(info.secretToken, info.username, info.password)) {
        let post = recieveFromDb("/Posts/" + info.postId);
        let user = recieveFromDb("/Users/" + info.username);
        if (!user || !post || post.author != user.username) {
            res.send(null);
            return;
        }
        await db.remove("/Posts/" + info.postId);
        await db.remove("/Users/" + user + "/Posts/" + info.postId);
    }
    res.send(0);
});

// editPost
// secretToken, userData, postData
// edits post created by user
// returns if edited
app.post("/editPost", async (req, res) => {
    // TODO: implement
});

// getPosts
// secretToken, username, password
// gets posts of specific user, does not update views
// returns posts info
app.post("/getPosts", async (req, res) => {
    // TODO: test, comments, limit amount sent
    let info = req.body;
    if (info.username && info.password && info.secretToken) {
        if (!authorized(info.username, info.password)) {
            res.send(null);
            return;
        }
        let data = await recieveFromDb("/Users/" + username + "/Posts/");
        let output = [];
        for (i = 0; i < data.length; i++) {
            output.push(await recieveFromDb("/Posts/" + data[0]));
        }
        res.send(output);
        return;
    }
    res.send(null);
});

// getLikedPOsts
// secretToken, username, password
// gets liked posts of specific user, does not update views
// returns posts
app.post("/getLikedPosts", async (req, res) => {
    // TODO: implement
});

// searchUser
// secretToken, username, password, targetUsername
// gets users based on username
// returns array
app.post("/searchUser", async (req, res) => {
    // TODO: implement
});

// signIn
// username, password
// signs in
// returns secretToken if accepted, otherwise no
app.post("/signIn", async (req, res) => {
    // TODO: test
    let info = req.body;
    if (info.username && info.password) {
        let username = info.username;
        let password = hash(info.password);

        // get user data from db
        let data = await recieveFromDb(`/UserData/${username}`);

        // check if both hashed passwords are the same
        if (data.password === password) {
            // will also need to send their secret code
            res.send(stringToHash(username + password));
            return;
        } else {
            // otherwise dont allow
            res.send(null);
            return;
        }
    } else {
        res.send(null);
    }
});

// signUp
// username, password, displayName, ...
// create account and sign in
// returns secretToken if accepted, otherwise no
app.post("/signUp", async (req, res) => {
    // TODO: test + can probably clean it up
    let info = req.body;
    if (info.username && info.password && info.displayName) {
        let username = info.username;
        let password = stringToHash(info.password);
        let displayName = info.displayName;

        // check if username contains / or \ (this will mess up database if it does)
        if (username.contains("/") || username.contains("\\")) {
            res.send(null);
            return;
        }
        // check if username exists
        if ((await recieveFromDb(`/UserData/${username}`)) != null) {
            res.send(null);
            return;
        }
        // otherwise upload
        let result = await uploadToDb(`/UserData/${username}`, {
            password: password,
            displayName: displayName,
            dateCreated: new Date().getTime(),
        });

        // if successful, return secret token
        if (result) {
            // will also need to send their private user data
            res.send(stringToHash(username + password));
        }
        // otherwise notify client
        else {
            res.send(null);
        }
    }
    // if not given the correct information, dont do anything
    else {
        res.send(null);
    }
});

// explorePosts
//
// gets popular posts, updates views
// returns posts
app.post("/explorePosts", async (req, res) => {
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

// searchPosts
// search
// gets popular posts within search criteria
// returns posts
app.post("/searchPosts", async (req, res) => {
    // TODO: limit amount sent back + check if this even works + filter by visibility
    let arr = [];
    let info = req.body;
    await db
        .ref("/Posts/")
        .orderByChild("popularity")
        .on("value", (val) => {
            if (val.title.includes(info.search)) {
                arr.push(val);
            }
        });
    res.send(arr);
});

// likePost
// secretToken, userData, postData
// likes a post
// returns nothing
app.post("/likePost", async (req, res) => {
    let info = req.body;
    // Checks if all needed variables were sent, and verifies username and password.
    if (
        !info.username ||
        !info.password ||
        !info.secretToken ||
        !info.postId ||
        !authorized(info.secretToken, info.username, info.password)
    ) {
        res.send(null);
        return;
    }

    let result = await db.recieveFromDb("/Posts/" + info.postId);
    if (result == null) {
        res.send(null);
        return;
    }

    // TODO: NEED TO CHECK IF USER HAS ALREADY LIKED POST, UNLIKE IF THEY HAVE

    let output = await db.uploadToDb("/Posts/" + info.postId + "/likes", result.likes + 1);
    res.send(0);
});

async function updateLikes(info) {
    // recieveFromDb
    // uploadToDb
}

// stolen hash function // https://www.educba.com/javascript-hash/
function stringToHash(string) {
    //set variable hash as 0
    var hash = 0;
    string = process.env.secretCode + string + process.env.secretCode;
    // if the length of the string is 0, return 0
    if (string.length == 0) return hash;
    for (i = 0; i < string.length; i++) {
        ch = string.charCodeAt(i);
        hash = (hash << 5) - hash + ch;
        hash = hash & hash;
    }
    return hash;
}

async function recieveFromDb(info) {
    let result = (await db.ref(info.location).once("value"))
        .val()
        .then((data) => {
            return data;
        })
        .catch((err) => {
            return null;
        });
    return result;
}

async function uploadToDb(location, value) {
    let result = await db
        .ref(location)
        .set(value)
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });
    // return result;
    return true;
}

async function removeFromDb(location) {
    let result = await db
        .ref(location)
        .remove()
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });
    return result;
}

async function recieveFile(info) {
    var stream = await FirebaseStorage.requestFile(info.fileLocation);
    return stream;
    // how to send data to res: stream.pipe(res);
}

async function uploadFile(audioChunks, username) {
    let result = await FirebaseStorage.uploadFile(audioChunks, username)
        .then(() => {
            return true;
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
    return result;
}

function authorized(secretToken, username, password) {
    return secretToken === stringToHash(username + stringToHash(password));
}

var PORT = 8000;
app.listen(PORT, () => {
    console.log("Server started on port: " + PORT);
});
