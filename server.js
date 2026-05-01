require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const journalRoutes = require("./routes/journalRoutes");

const app = express();

/* =======================
   ✅ CORS CONFIG
======================= */
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://mental-wellbeing-full.vercel.app"
  ],
  credentials: true
}));

/* =======================
   ✅ MIDDLEWARE
======================= */
app.use(express.json());

/* =======================
   ✅ ROOT ROUTE
======================= */
app.get("/", (req, res) => {
  res.json({ message: "Backend is LIVE 🚀" });
});

/* =======================
   ✅ HEALTH CHECK
======================= */
app.get("/health", (req, res) => {
  res.send("OK");
});

/* =======================
   ✅ API ROUTES
======================= */
app.use("/api", journalRoutes);

/* =======================
   ✅ PORT
======================= */
const PORT = process.env.PORT || 5000;

/* =======================
   ✅ DATABASE CONNECTION
======================= */
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log("MongoDB connected ✅");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error("DB Connection Error ❌:", err.message);
  process.exit(1);
});

/* =======================
   ✅ ERROR HANDLER
======================= */
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({
    success: false,
    error: "Internal Server Error"
  });
});
