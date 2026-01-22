import express from "express";
import cors from "cors";
import recharges from './routes/recharges.js';
import transfer from './routes/transfer.js';
import retrait from './routes/retrait.js';
import dashboard from './routes/dashboard.js';

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;


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


app.listen(port, () => {
  console.log(`🚀  server running on port ${port}`);
});


