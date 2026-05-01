const mongoose = require("mongoose");

const EntrySchema = new mongoose.Schema({
  userId: {
    type: String,
    default: "demo-user"
  },

  text: {
    type: String,
    required: true
  },

  // ✅ entered mood (existing)
  mood: {
    type: String,
    required: true
  },

  // 🔥 NEW: predicted mood from NLP
  predictedMood: {
    type: String
  },

  // 🔥 NEW: comparison (optional but useful)
  moodComparison: {
    type: String,
    enum: ["Match", "Mismatch"]
  },

  sentimentScore: {
    type: Number,
    required: true
  },

  severity: {
    type: String,
    enum: ["Low", "Moderate", "High"],
    required: true
  },

  mismatch: {
    type: Boolean,
    default: false
  },

  perceptionType: {
    type: String,
    enum: ["Aligned", "Masking Stress", "Resilience"],
    default: "Aligned"
  },

  // 🔥 OPTIONAL: extra insights
  confidence: {
    type: Number
  },

  insight: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Entry", EntrySchema);
