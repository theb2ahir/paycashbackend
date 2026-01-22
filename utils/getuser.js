import { db } from '../firebase.js';

async function getUser(userId) {
    return db.collection("users").doc(userId).get().then(doc => {
        return doc.data();
    });
}

export default getUser;