import express from 'express';
import { chatNotif } from '../services/notificationService';
const router = express.Router();

router.post("/sendmessage", async (req, res) => {
    const { userId, message, senderId } = req.body;

    if (!userId || !message || !senderId) {
        return res.status(400).json({ error: "Paramètres invalides" });
    }

    chatNotif(userId, message, senderId);

    return res.json({
        status: "success",
        message: "Message envoyé avec succès",
    });
});

export default router;
