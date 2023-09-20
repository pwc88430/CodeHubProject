const { getStorage, ref, upladBytes } = require('firebase-admin/storage')
const { bucket } = require('./firebaseInit')


const cf = function () {

    const file = new File(["foo"], "foo.txt", {
        type: "text/plain"
    });


}


module.exports = cf;
