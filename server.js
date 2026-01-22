import express from "express";
import cors from "cors";
import recharges from './routes/recharges.js';
import transfer from './routes/transfer.js';
import retrait from './routes/retrait.js';
import dashboard from './routes/dashboard.js';
import sendnotif from './routes/transactionnotif.js';
const admin = require("firebase-admin");
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.get("/", (req, res) => {
  res.send("✅ PayCash SIMULATION server running");
});

app.get("/paycashTEST", (req, res) => {
  res.send("✅ PayCash SIMULATION test route working");
});


// appeler les routes

app.use("/paycashRECHARGE", recharges);
app.use("/paycashTRANSFERT", transfer);
app.use("/paycashRETRAIT", retrait);
app.use("/paycashDASHBOARD", dashboard);
app.use("/paycashNOTIF", sendnotif);


app.listen(PORT, () => {
  console.log(`🚀 Simulation server running on http://localhost:${PORT}`);
});


