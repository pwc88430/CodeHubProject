var admin = require("firebase-admin");
require("dotenv").config();
const { getStorage } = require("firebase-admin/storage");

var serviceAccount = {
    type: process.env.type,
    project_id: process.env.project_id,
    private_key: process.env.private_key,
    private_key_id: process.env.private_key_id,
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url,
    universe_domain: process.env.universe_domain,
};

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.databaseURL,
    storageBucket: process.env.storageBucket,
});

var db = admin.database();

const bucket = getStorage().bucket();

module.exports = { db, bucket, app };
