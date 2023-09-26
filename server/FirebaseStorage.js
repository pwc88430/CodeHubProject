// const { getStorage, ref, upladBytes } = require('firebase-admin/storage')
const { bucket, app } = require('./firebaseInit')

// important: https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API

module.exports = class FirebaseStorage {
    static async uploadFile(){
        // data to object | replace with inputted data in function | ex. uploadFile(audioBlob)
        const obj = { hello: "world" };
        // object to blob | replace with audio/mpeg blob or recordedChunks and turn to blob
        const blob = new Blob([JSON.stringify(obj, null, 2)], {
            type: "application/json",
        });
        // blob to arrayBuffer
        const arrayBuffer = await blob.arrayBuffer();
        // arrayBuffer to buffer
        const buffer = Buffer.from(arrayBuffer);

        // file destination for Firebase Storage
        const destination = bucket.file("path/foo.json")

        // create stream to destination
        const writeStream = destination.createWriteStream({
            metadata: {
                // audio/mpeg
                contentType: "application/json",
            },
        })

        // pipe buffer to stream (upload buffer to Storage)
        writeStream.end(buffer);

        // bucket.upload(buffer, {
        //     destination: "path/foo.json",
        //     metadata: {
        //         contentType: "application/json",
        //     },
        // })
    }
}