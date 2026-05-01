require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const journalRoutes = require("./routes/journalRoutes");

const app = express();

/* ✅ Middleware */

// 🔥 Better CORS (important for frontend + Render)
app.use(cors({
  origin: "*", // you can restrict later
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

/* ✅ Root route (fixes "Cannot GET /") */
app.get("/", (req, res) => {
  res.json({ message: "Backend is LIVE 🚀" });
});

/* ✅ API routes */
app.use("/api", journalRoutes);

/* ❗ 404 Handler (must be before error handler) */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found"
  });
});

/* ❗ Error handler (must be LAST middleware) */
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);

  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: err.message
  });
});

/* ✅ Port */
const PORT = process.env.PORT || 5000;

/* ✅ DB Connection + Server Start */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
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
