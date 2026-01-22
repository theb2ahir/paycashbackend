import express from 'express';
import { db } from '../firebase.js';
import { generateTransfertToken } from '../utils/token.js';
import { TransfertNotif } from '../services/notificationService.js';
const router = express.Router();


router.post("/transfer", async (req, res) => {
    try {
        const { fromUserId, toUserId, amount } = req.body;

        if (!fromUserId || !toUserId || amount <= 0) {
            return res.status(400).json({ error: "Paramètres invalides" });
        }

        // Récupérer les utilisateurs
        const senderDoc = await db.collection("users").doc(fromUserId).get();
        const receiverDoc = await db.collection("users").doc(toUserId).get();

        if (!senderDoc.exists || !receiverDoc.exists) {
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }

        const sender = senderDoc.data();
        const receiver = receiverDoc.data();

        if ((sender.balance || 0) < amount) {
            return res.status(400).json({ error: "Solde insuffisant" });
        }

        // Mettre à jour les balances dans Firestore
        await db.collection("users").doc(fromUserId).update({
            balance: sender.balance - amount,
        });

        await db.collection("users").doc(toUserId).update({
            balance: (receiver.balance || 0) + amount,
        });

        // Générer token
        let token = generateTransfertToken(fromUserId, toUserId, amount);

        // Ajouter transaction
        await db.collection("global_transactions").add({
            type: "TRANSFER",
            from: fromUserId,
            to: toUserId,
            token,
            amount,
            date: new Date(),
        });

        TransfertNotif(fromUserId, toUserId, amount);

        res.json({
            status: "success",
            message: "Transfert réussi",
            token,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});


export default router;