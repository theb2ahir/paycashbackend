import express from 'express';
import { db } from '../firebase.js';
import { COMPANY_BALANCE } from '../utils/companie.js';


const router = express.Router();

router.get("/dashboard", async (req, res) => {
    try {
        // 🔹 Récupérer toutes les transactions, triées par date décroissante
        const snapshot = await db.collection("global_transactions").orderBy("date", "desc").get();

        const rows = snapshot.docs.map(doc => {
            const t = doc.data();

            // Adapter l'affichage selon le type de transaction
            let userIdDisplay = t.userId || "";
            let fromDisplay = t.from || "";
            let toDisplay = t.to || "";
            let numberDisplay = t.number || "";
            let operatorDisplay = t.operator || "";

            return `
                <tr>
                    <td>${t.type}</td>
                    <td class="userId">${userIdDisplay || `${fromDisplay} → ${toDisplay}`}</td>
                    <td class="token">${t.token || ""}</td>
                    <td>${numberDisplay || "_"}</td>
                    <td>${operatorDisplay || "Entre users"}</td>
                    <td>${t.amount} FCFA</td>
                    <td>${new Date(t.date.seconds * 1000).toLocaleString()}</td>
                </tr>
            `;
        }).join("");


        res.send(`
        <!DOCTYPE html>
        <html>
        <head>
        <title>PayCash – Simulation</title>
        <style>
        body { font-family: Arial; background: #f4f2ef; padding: 30px; }
        .card { background: white; margin: auto; padding: 30px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .balance { font-size: 36px; color: #6D4C41; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; border-bottom: 1px solid #ddd; }
        td.token {max-width: 500px ; word-break: break-all; }
        td.userId {max-width: 500px ; word-break: break-all; }
        th { background: #6D4C41; color: white; }
        </style>
        </head>
        <body>
        <div class="card">
            <h3>📜 Transactions</h3>
            <table>
                <tr>
                <th>Type</th>
                <th>User / From → To</th>
                <th>Token</th>
                <th>Numéro</th>
                <th>Opérateur</th>
                <th>Montant</th>
                <th>Date</th>
            </tr>
            ${rows}
            </table>
        </div>
        </body>
        </html>
        `);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la récupération des transactions");
    }
});


export default router;