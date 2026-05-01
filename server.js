require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const journalRoutes = require("./routes/journalRoutes");

const app = express();

// ✅ CORS (local + deployed frontend)
app.use(cors({
  origin: [
    "https://mental-wellbeing-full.vercel.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Middleware
app.use(express.json());

// ✅ Root route
app.get("/", (req, res) => {
  res.json({ message: "Backend is LIVE 🚀" });
});

// ✅ API routes
app.use("/api", journalRoutes);

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({
    success: false,
    error: err.message || "Internal Server Error"
  });
});

// ✅ Connect DB and start server
const PORT = process.env.PORT || 5000;

// 🔥 Debug (remove after deployment works)
console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
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
