const { db, bucket } = require("../../firebaseInit");
const FirebaseStorage = require("../../FirebaseStorage");

module.exports = class Helper {
    /**
     * This function creates an error object and returns it.
     * @param {String} message The error message to give.
     * @returns Returns error object.
     */
    static Error(message) {
        console.error(message);
        return {
            type: "Error",
            error: message,
        };
    }

    /** This is a modified stolen hash function https://www.educba.com/javascript-hash/
     *
     * Converts given string to hash.
     * @param {String} string The string to hash.
     * @returns {String} Returns hashed version of the given string.
     */
    static stringToHash(string) {
        //set variable hash as 0
        var hash = 0;
        string = process.env.secretCode + string + process.env.secretCode;
        // if the length of the string is 0, return 0
        if (string.length == 0) return hash;
        for (var i = 0; i < string.length; i++) {
            let ch = string.charCodeAt(i);
            hash = (hash << 5) - hash + ch;
            hash = hash & hash;
        }
        return hash;
    }

    static async recieveFromDb(location) {
        try {
            let result = (await db.ref(location).once("value")).val();
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async uploadToDb(location, value) {
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

    static async removeFromDb(location) {
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

    static async recieveFile(fileLocation) {
        var url = await FirebaseStorage.requestFile(fileLocation);
        return url;
    }

    static async uploadFile(audioChunks, username, currentTime) {
        audioChunks = audioChunks.substring(35, audioChunks.length);
        const byteCharacters = atob(audioChunks);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        } // for
        const byteArray = new Uint8Array(byteNumbers);
        const audioBlob = new Blob([byteArray], { type: "audio/ogg; codecs=opus" });

        let result = await FirebaseStorage.uploadFile(audioBlob, username, currentTime)
            .then(() => {
                return true;
            })
            .catch((err) => {
                console.log(err);
                return false;
            });
        return result;
    }

    static authorized(secretToken, username, password) {
        return secretToken === Helper.stringToHash(username + password);
    }
};
