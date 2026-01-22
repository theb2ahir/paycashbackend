import express from 'express';
// importer db firestore
import { db } from '../firebase.js';
import { generateToken } from '../utils/token.js';
import { COMPANY_BALANCE } from '../utils/companie.js';
import { RetraitNotif } from '../services/notificationService.js';
const router = express.Router();


router.post("/withdraw", async (req, res) => {
    const { userId, amount, number, operator } = req.body;

    if (!userId || !amount || amount <= 0 || !number || !operator) {
        return res.status(400).json({ error: "Paramètres invalides" });
    }
    let token = generateToken(userId, amount, number, operator);
    const userDoc = await db.collection("users").doc(userId).get();

    if (COMPANY_BALANCE < amount) {
        return res.status(400).json({ error: "Pas assez de FCFA dans le coffre" });
    }

    // verifier balance du user dans firestore collection "users"

    if (userDoc.data().balance < amount) {
        return res.status(400).json({ error: "votre solde est insuffisant" });
    }


    if (userDoc.data().balance >= amount) {
        db.collection("users").doc(userId).update({
            balance: userDoc.data().balance - amount,
        });
    }

    // ajouter transaction a firestore collection "global_transactions"
    db.collection("global_transactions").add({
        type: "WITHDRAW",
        userId,
        token,
        number,
        operator,
        amount,
        date: new Date(),
    });

    await RetraitNotif(userId, amount, number, operator);

    return res.json({
        status: "success",
        message: "Retrait réussi",
        token: token,
    });
});

export default router;
