// const { getStorage, ref, upladBytes } = require('firebase-admin/storage')
const { bucket, app } = require('./firebaseInit')


module.exports = class FirebaseStorage {
    static uploadFile(){
        bucket.upload("./foo.txt", {
            destination: "path/foo.txt",
            metadata: {
                contentType: "text/plain",
            },
        })
    }
}