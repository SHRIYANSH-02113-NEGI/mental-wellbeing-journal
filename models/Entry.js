const mongoose = require("mongoose");

const EntrySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },

  text: {
    type: String,
    required: true
  },

  mood: {
    type: String,
    required: true
  },

  predictedMood: {
    type: String
  },

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

  confidence: {
    type: Number
  },

  insight: {
    type: String
  }

}, { timestamps: true });

module.exports = mongoose.model("Entry", EntrySchema);
