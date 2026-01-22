import admin from "firebase-admin";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Charger la clé de service
const serviceAccount = require(
    process.env.GOOGLE_APPLICATION_CREDENTIALS
);

// Initialisation Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

// Exports utiles
const db = admin.firestore();
const auth = admin.auth();
const messaging = admin.messaging();

export { admin, db, auth, messaging };
