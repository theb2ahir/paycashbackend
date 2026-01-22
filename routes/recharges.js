import express from 'express';
import { generateToken } from '../utils/token.js';
import { db } from '../firebase.js';
import { RechargeNotif } from '../services/notificationService.js';

const router = express.Router();
router.post("/recharge", async (req, res) => {
    const { userId, amount, number, operator } = req.body;

    if (!userId || !amount || amount <= 0 || !number || !operator) {
        return res.status(400).json({ error: "Paramètres invalides" });
    }

    let token = generateToken(userId, amount, number, operator);
    const userDoc = await db.collection("users").doc(userId).get();


    db.collection("users").doc(userId).update({
        balance: userDoc.data().balance + amount,
    });

    // ajouter transaction a firestore collection "global_transactions"
    db.collection("global_transactions").add({
        type: "RECHARGE",
        userId,
        token,
        number,
        operator,
        amount,
        date: new Date(),
    });

    await RechargeNotif(userId, amount, number, operator);

    return res.json({
        status: "success",
        message: "Recharge réussie",
        token: token,
    });
});

export default router;