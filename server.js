require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const journalRoutes = require("./routes/journalRoutes");

const app = express();

/* Middleware */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

/* Auto UserId Middleware */
app.use((req, res, next) => {
  let userId = req.headers["x-user-id"];

  if (!userId) {
    userId = "user_" + Math.random().toString(36).substr(2, 9);
  }

  req.userId = userId;
  next();
});

/* Root */
app.get("/", (req, res) => {
  res.json({ message: "Backend is LIVE 🚀" });
});

/* Routes */
app.use("/api", journalRoutes);

/* 404 */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* Error */
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

/* DB + Server */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
