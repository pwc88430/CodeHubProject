// const { getStorage, ref, upladBytes } = require('firebase-admin/storage')
const { bucket, app } = require('./firebaseInit')

// important: https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API

module.exports = class FirebaseStorage {
    static async requestFile(fileLocation){
        const file = bucket.file(fileLocation);
        const readStream = file.createReadStream();

        return readStream;
    }

    static async uploadFile(audioObj, userName){
        const blob = new Blob(audioObj, {
            // audio/mpeg (mp3)
            type: "audio/mpeg",
        });

        // converting blob to buffer
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        var userLocation = userName;
        var fileName = new Date().getTime();

        // file from destination for Firebase Storage (there is no file there yet)
        const file = bucket.file(`audioFiles/${userLocation}/${fileName}.mp3`)

        // create stream to destination
        const writeStream = file.createWriteStream({
            metadata: {
                // audio/mpeg (mp3)
                contentType: "audio/mpeg",
            },
        })

        // pipe buffer to stream (upload buffer to Storage)
        writeStream.end(buffer);

        // return file location so server can add it to whatever it needs
        return `${userLocation}/${fileName}.mp3`;
    }
}