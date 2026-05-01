const mongoose = require("mongoose");

const EntrySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },

  // 🔥 NEW STRUCTURE
  content: {
    text: {
      type: String,
      required: true
    }
  },

  mood: {
    entered: {
      type: String,
      required: true
    },
    predicted: String,
    comparison: String
  },

  analysis: {
    sentimentScore: {
      type: Number,
      required: true
    },
    severity: {
      type: String,
      enum: ["Low", "Moderate", "High"],
      required: true
    },
    mismatch: Boolean,
    perceptionType: String,
    confidence: Number,
    insight: String
  }

}, { timestamps: true });

module.exports = mongoose.model("Entry", EntrySchema);
