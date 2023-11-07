// const { getStorage, ref, upladBytes } = require('firebase-admin/storage')
const { bucket, app } = require("./firebaseInit");

// important: https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API

module.exports = class FirebaseStorage {
    static async requestFile(fileLocation) {
        console.log(fileLocation);
        const file = bucket.file(fileLocation);
        const getUrlPromise = new Promise(async (resolve, reject) => {
            file.getSignedUrl(
                {
                    action: "read",
                    expires: "01-01-2150",
                },
                (err, url) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(url);
                    }
                }
            );
        });

        let output = null;
        try {
            output = await getUrlPromise;
        } catch (err) {
            console.error(err);
        }
        return output;
    }

    static async uploadFile(audioObj, userName, givenTime) {
        //const blob = new Blob(audioObj, {
        // audio/mpeg (mp3)
        // type: "audio/mpeg",
        //  });

        // converting blob to buffer
        const arrayBuffer = await audioObj.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        var userLocation = userName;

        // file from destination for Firebase Storage (there is no file there yet)
        const file = bucket.file(`audioFiles/${userLocation}/${givenTime}.mp3`);

        // create stream to destination
        const writeStream = file.createWriteStream({
            metadata: {
                // audio/mpeg (mp3)
                contentType: "audio/mpeg",
            },
        });

        // pipe buffer to stream (upload buffer to Storage)
        writeStream.end(buffer);

        // return file location so server can add it to whatever it needs
        return `${userLocation}/${givenTime}.mp3`;
    }
};
