require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const journalRoutes = require("./routes/journalRoutes");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Root route (fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.json({ message: "Backend is LIVE 🚀" });
});

// ✅ API routes
app.use("/api", journalRoutes);

// ✅ Port (Render provides PORT automatically)
const PORT = process.env.PORT || 5000;

// ✅ Connect DB THEN start server (IMPORTANT)
mongoose
  .connect(process.env.MONGO_URI)
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

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({
    success: false,
    error: "Internal Server Error"
  });
});
