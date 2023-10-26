var express = require("express");
var app = express();
app.use(express.json());
var cors = require("cors");

const createPostRoute = require("./methods/createPost");
const deletePostRoute = require("./methods/deletePost");
const editPostRoute = require("./methods/editPost");
const explorePostsRoute = require("./methods/explorePosts");
const getLikedPostsRoute = require("./methods/getLikedPosts");
const getPostsRoute = require("./methods/getPosts");
const likePostRoute = require("./methods/likePost");
const searchPostsRoute = require("./methods/searchPosts");
const searchUserRoute = require("./methods/searchUser");
const signInRoute = require("./methods/signIn");
const signUpRoute = require("./methods/signUp");

app.use(
    cors({
        allowedHeaders: ["Content-Type"],
        exposedHeaders: ["Content-Type"],
        origin: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: true,
    })
);

app.get("/", (req, res) => {
    res.send("Server online");
});

app.use("/createPost", createPostRoute);
app.use("/deletePost", deletePostRoute);
app.use("/editPost", editPostRoute);
app.use("/explorePosts", explorePostsRoute);
app.use("/getLikedPosts", getLikedPostsRoute);
app.use("/getPosts", getPostsRoute);
app.use("/likePost", likePostRoute);
app.use("/searchPosts", searchPostsRoute);
app.use("/searchUser", searchUserRoute);
app.use("/signIn", signInRoute);
app.use("/signUp", signUpRoute);

var PORT = 8000;
app.listen(PORT, () => {
    console.log("Server started on port: " + PORT);
});
