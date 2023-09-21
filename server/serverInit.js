
const { db, bucket } = require('./firebaseInit')
var express = require('express');
var app = express();
const { ref, set, get, child, remove } = require("firebase-admin/database")
const FirebaseStorage = require('./FirebaseStorage')


app.get('/', (req, res) => {
    res.send('Hello World');
})

app.get('/random', (req, res) => {
    res.send('ss World');
})

app.get('/recieve', async (req, res) => {
    let data = (await db.ref("/awd").once('value')).val();
    console.log(data)
})

app.get('/send', async (req, res) => {
    db.ref('/flt').set('helllo')
    res.send(200)
})

app.get('/uploadFile', async (req, res) => {
    FirebaseStorage.uploadFile();
    res.sendStatus(200);
})


var PORT = 8000;
app.listen(PORT, ()=>{
    console.log("Server started on port: " + PORT);
});









