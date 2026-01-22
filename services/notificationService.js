import { messaging, db } from "../firebase.js";

export const RechargeNotif = async (
    userId,
    amount,
    number,
    operator
) => {
    try {
        // Récupérer le token FCM depuis Firestore
        const userDoc = await db.collection("users").doc(userId).get();

        if (!userDoc.exists) {
            console.log("Utilisateur introuvable");
            return;
        }

        const fcmToken = userDoc.data().fcmToken;

        if (!fcmToken) {
            console.log("Aucun FCM token pour cet utilisateur");
            return;
        }

        const message = {
            token: fcmToken,
            title: "Recharge réussie ✅",
            body: `Recharge de ${amount} FCFA sur ${number} (${operator})`,

        };

        await messaging.send(message);
    } catch (error) {
        console.error("Erreur notification:", error.message);
    }
};

export const TransfertNotif = async (
    fromUserId,
    toUserId,
    amount,
) => {
    try {
        // Récupérer le token FCM depuis Firestore
        const fromUserDoc = await db.collection("users").doc(fromUserId).get();
        const toUserDoc = await db.collection("users").doc(toUserId).get();

        if (!fromUserDoc.exists || !toUserDoc.exists) {
            console.log("Utilisateur introuvable");
            return;
        }

        const fromFcmToken = fromUserDoc.data().fcmToken;
        const toFcmToken = toUserDoc.data().fcmToken;
        const fromname = fromUserDoc.data().name;
        const toname = toUserDoc.data().name;

        if (!fromFcmToken || !toFcmToken) {
            console.log("Aucun FCM token pour ces utilisateurs");
            return;
        }

        const message1 = {
            token: fromFcmToken,
            title: "PayCash",
            body: `Transfert de ${amount} FCFA a ${toname}`,

        };
        const message2 = {
            token: toFcmToken,
            title: "PayCash",
            body: `Vous avez reçu ${amount} FCFA de ${fromname}`,

        };

        await messaging.send(message1);
        await messaging.send(message2);
    } catch (error) {
        console.error("Erreur notification:", error.message);
    }
};

export const RetraitNotif = async (
    userId,
    amount,
    number,
    operator
) => {
    try {
        // Récupérer le token FCM depuis Firestore
        const userDoc = await db.collection("users").doc(userId).get();

        if (!userDoc.exists) {
            console.log("Utilisateur introuvable");
            return;
        }

        const fcmToken = userDoc.data().fcmToken;

        if (!fcmToken) {
            console.log("Aucun FCM token pour cet utilisateur");
            return;
        }

        const message = {
            token: fcmToken,
            title: "Retrait réussi ✅",
            body: `Retrait de ${amount} FCFA sur ${number} (${operator})`,
        };

        await messaging.send(message);
    } catch (error) {
        console.error("Erreur notification:", error.message);
    }
};


export default {
    RechargeNotif,
    TransfertNotif,
    RetraitNotif,
};