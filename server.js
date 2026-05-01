require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const journalRoutes = require("./routes/journalRoutes");

const app = express();

// ✅ Better CORS (allows local + deployed frontend)
const allowedOrigins = [
  "https://mental-wellbeing-full.vercel.app",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ✅ Root route (for Render health check)
app.get("/", (req, res) => {
  res.send("Backend is LIVE 🚀");
});

// ✅ Routes
app.use("/api", journalRoutes);

// ✅ Error handler (improved)
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message || "Something went wrong" });
});

// ✅ Connect DB THEN start server (IMPORTANT)
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas connected ✅");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  })
  .catch(err => {
    console.error("DB Error:", err);
    process.exit(1);
  });
