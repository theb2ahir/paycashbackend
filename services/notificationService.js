import { messaging, db } from "../firebase.js";

export const RechargeNotif = async (userId, amount, number, operator) => {
    try {
        const userDoc = await db.collection("users").doc(userId).get();
        if (!userDoc.exists) return;

        const fcmToken = userDoc.data().fcmToken;
        if (!fcmToken) return;

        await messaging.send({
            token: fcmToken,
            notification: {
                title: "Recharge réussie ✅",
                body: `Recharge de ${amount} FCFA sur ${number} (${operator})`,
            },
            data: {
                type: "RECHARGE",
                amount: amount.toString(),
                operator,
            },
        });
    } catch (error) {
        console.error("RechargeNotif:", error.message);
    }
};

export const TransfertNotif = async (fromUserId, toUserId, amount) => {
    try {
        const [fromUserDoc, toUserDoc] = await Promise.all([
            db.collection("users").doc(fromUserId).get(),
            db.collection("users").doc(toUserId).get(),
        ]);

        if (!fromUserDoc.exists || !toUserDoc.exists) return;

        const fromToken = fromUserDoc.data().fcmToken;
        const toToken = toUserDoc.data().fcmToken;

        if (!fromToken || !toToken) return;

        const fromName = fromUserDoc.data().name;
        const toName = toUserDoc.data().name;

        await Promise.all([
            messaging.send({
                token: fromToken,
                notification: {
                    title: "PayCash",
                    body: `Transfert de ${amount} FCFA à ${toName}`,
                },
                data: { type: "TRANSFERT_SENT" },
            }),
            messaging.send({
                token: toToken,
                notification: {
                    title: "PayCash",
                    body: `Vous avez reçu ${amount} FCFA de ${fromName}`,
                },
                data: { type: "TRANSFERT_RECEIVED" },
            }),
        ]);
    } catch (error) {
        console.error("TransfertNotif:", error.message);
    }
};

export const RetraitNotif = async (userId, amount, number, operator) => {
    try {
        const userDoc = await db.collection("users").doc(userId).get();
        if (!userDoc.exists) return;

        const fcmToken = userDoc.data().fcmToken;
        if (!fcmToken) return;

        await messaging.send({
            token: fcmToken,
            notification: {
                title: "Retrait réussi ✅",
                body: `Retrait de ${amount} FCFA sur ${number} (${operator})`,
            },
            data: {
                type: "RETRAIT",
                amount: amount.toString(),
            },
        });
    } catch (error) {
        console.error("RetraitNotif:", error.message);
    }
};

export const chatNotif = async (userId, message, senderId) => {
    try {
        const userDoc = await db.collection("users").doc(userId).get();
        const senderDoc = await db.collection("users").doc(senderId).get();
        if (!userDoc.exists) return;

        const fcmToken = userDoc.data().fcmToken;
        const senderName = senderDoc.data().name;
        if (!fcmToken || !senderName) return;

        await messaging.send({
            token: fcmToken,
            notification: {
                title: "Nouveau message de " + senderName,
                body: message,
            },
            data: { type: "CHAT" },
        });
    } catch (error) {
        console.error("chatNotif:", error.message);
    }
}
