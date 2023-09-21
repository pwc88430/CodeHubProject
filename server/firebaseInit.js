var admin = require('firebase-admin');
require('dotenv').config();
const { getStorage } = require('firebase-admin/storage')

var serviceAccount = {
    projectId: process.env.project_id,
    privateKey: process.env.private_key?.replace(/\\n/g, '\n'),
    clientEmail: process.env.client_email
}

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.databaseURL,
    storageBucket: process.env.storageBucket
});

var db = admin.database();

const bucket = getStorage().bucket();

module.exports = { db, bucket, app };