
const { db, bucket } = require('./firebaseInit')
var express = require('express');
var app = express();
app.use(express.json());
const { ref, set, get, child, remove } = require("firebase-admin/database")
const FirebaseStorage = require('./FirebaseStorage')
var cors = require('cors');

const secretToken = process.env.secret_token;


app.use(cors({
    allowedHeaders: ['Content-Type'],
    exposedHeaders: ['Content-Type'],
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: true
}));

// should change every api function thing to its own script and make a helper class

app.get('/', (req, res) => {
    res.send('Server online');
})

// Post = {
//         likes: 0, 
//         views: 1, 
//         title: "this is the title", 
//         audioLocation: "audioFiles/location", 
//         popularity: 100, 
//         lastInteracted: "0008109581", 
//         dateCreated: "10581515", 
//         author: user,
//         authorName: displayname,
//         visibility: 0,
//        }

// createPost
// secretToken, userData, postTitle, audioChunks
// creates post
// returns if post is allowed to upload
app.post('/createPost', async (req, res) => {
    // ------------------------------
    // UNTESTED
    // ------------------------------
    let info = req.body;
    console.log('request recieved')

    // no verification yet

    let post = {
        likes: 0,
        views: 1,
        title: info.postTitle,
        audioLocation: `audioFiles/${info.userData.username}/${new Date().getTime()}`,
        popularity: 100,
        lastInteraction: 0,
        dateCreated: new Date().getTime(),
        author: info.userData.username,
        authorName: info.userData.displayName,
        visibility: 0,
    }

    let storageResult = await uploadFile(info.audioChunks, info.userData.username).catch((err) => { return false });
    console.log(storageResult)
    let databaseResult = await uploadToDb(info.userData.username + "Post:" + new Date().getTime(), post).catch((err) => { return false });
    console.log(databaseResult)
    res.send((storageResult && databaseResult));
})

// deletePost
// secretToken, userData, postData
// deletes users post
// returns if deleted
app.post('/deletePost', async (req, res) => {

})

// editPost
// secretToken, userData, postData
// edits post created by user
// returns if edited
app.post('/editPost', async (req, res) => {

})

// getPosts
// secretToken, publicUserData
// gets posts of specific user, does not update views
// returns posts info
app.post('/getPosts', async (req, res) => {

})

// getLikedPOsts
// secretToken, publicUserData
// gets liked posts of specific user, does not update views
// returns posts
app.post('/getLikedPosts', async (req, res) => {

})

// searchUser
// secretToken
// gets users based on username
// returns publicUserData array
app.post('/searchUser', async (req, res) => {

})

// signIn
// username, password
// signs in
// returns secretToken if accepted, otherwise no
app.post('/signIn', async (req, res) => {
    // ------------------------------
    // UNTESTED
    // ------------------------------
    let info = req.body;
    if (info.username && info.password) {
        let username = info.username;
        let password = hash(info.password);

        // get user data from db
        let data = await recieveFromDb(`/UserData/${username}`);

        // check if both hashed passwords are the same
        if (data.password === password) {
            // will also need to send their private user data
            res.send(secretToken);
            return;
        } else { // otherwise dont allow
            res.send(null);
            return;
        }
    }
    else {
        res.send(null);
    }
})

// signUp
// username, password, ...
// create account and sign in 
// returns secretToken if accepted, otherwise no
app.post('/signUp', async (req, res) => {
    // ------------------------------
    // UNTESTED
    // ------------------------------
    let info = req.body;
    if (info.username && info.password && info.displayName) {
        let username = info.username;
        let password = info.password;
        let displayName = info.displayName;

        // check if username contains / or \ (this will mess up database if it does)
        if (username.contains("/") || username.contains("\\")) {
            res.send(null);
            return;
        }
        // check if username exists
        if (await recieveFromDb(`/UserData/${username}`) != null) {
            res.send(null);
            return;
        }
        // otherwise upload
        let result = await uploadToDb(`/UserData/${username}`, { password: hash(password), displayName: displayName, dateCreated: new Date().getTime() })

        // if successful, return secret token
        if (result) {
            // will also need to send their private user data
            res.send(secretToken)
        }
        // otherwise notify client
        else {
            res.send(null)
        }

    }
    // if not given the correct information, dont do anything
    else {
        res.send(null);
    }
})

// explorePosts
// secretToken
// gets popular posts, updates views
// returns posts
app.post('/explorePosts', async (req, res) => {

})

// likePost
// secretToken, userData, postData
// likes a post
// returns nothing
app.post('/likePost', async (req, res) => {

})

async function updateLikes(info) {
    // recieveFromDb
    // uploadToDb
}

// stolen hash function // https://www.educba.com/javascript-hash/
function stringToHash(string) {
    //set variable hash as 0
    var hash = 0;
    // if the length of the string is 0, return 0
    if (string.length == 0) return hash;
    for (i = 0; i < string.length; i++) {
        ch = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + ch;
        hash = hash & hash;
    }
    return hash;
}

async function recieveFromDb(info) {
    let result = (await db.ref(info.location).once('value')).val()
        .then((data) => {
            return data;
        })
        .catch((err) => {
            return null;
        })
    return result;
}

async function uploadToDb(location, value) {
    let result = await db.ref(location).set(value)
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        })
    // return result;
    return true;
}

async function removeFromDb(location) {
    let result = await db.ref(location).remove()
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        })
    return result;
}

async function recieveFile(info) {
    var stream = await FirebaseStorage.requestFile(info.fileLocation);
    return stream;
    //  stream.pipe(res);
}

async function uploadFile(audioChunks, username) {
    // audioData = {dateCreated: 0185185158, chunks: []}
    // dateCreated in milliseconds

    // userData = {dateCreated: 901581501, userName: "Bob"}
    // dateCreated in milliseconds

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

var PORT = 8000;
app.listen(PORT, () => {
    console.log("Server started on port: " + PORT);
});









