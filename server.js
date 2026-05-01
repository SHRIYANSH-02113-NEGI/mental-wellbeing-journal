const router = require("express").Router();
const Entry = require("../models/Entry");
const axios = require("axios");

/* Helper Functions */

function moodToExpectedRange(mood) {
  if (mood === "Happy") return [0.2, 1];
  if (mood === "Neutral") return [-0.2, 0.2];
  if (["Sad", "Anxious", "Stressed"].includes(mood))
    return [-1, -0.2];

  return [-1, 1];
}

function detectMismatch(mood, sentimentScore) {
  const [min, max] = moodToExpectedRange(mood);
  return sentimentScore < min || sentimentScore > max;
}

function perceptionType(mood, sentimentScore) {
  if (mood === "Happy" && sentimentScore < 0)
    return "Masking Stress";

  if (["Sad", "Anxious"].includes(mood) && sentimentScore > 0)
    return "Resilience";

  return "Aligned";
}

/* 🟢 POST ENTRY */
router.post("/entry", async (req, res) => {
  try {
    const { text, mood } = req.body;

    if (!text || !mood) {
      return res.status(400).json({ error: "Missing data" });
    }

    // 🔥 NLP API CALL
    const aiResponse = await axios.post(
      "https://nlp-service-aqmu.onrender.com/analyze",
      { text }
    );

    const aiResult = aiResponse.data;

    if (!aiResult.success) {
      throw new Error("NLP service failed");
    }

    const comparison =
      mood === aiResult.predicted_mood ? "Match" : "Mismatch";

    const mismatch = detectMismatch(mood, aiResult.score);

    const entry = new Entry({
      userId: req.userId,

      text,
      mood,

      predictedMood: aiResult.predicted_mood,
      moodComparison: comparison,

      sentimentScore: aiResult.score,
      severity: aiResult.severity,
      mismatch,
      perceptionType: perceptionType(mood, aiResult.score),

      confidence: Math.abs(aiResult.score),
      insight: mismatch
        ? "Your mood and feelings don’t match. Reflect a bit."
        : "Your feelings and mood are aligned."
    });

    await entry.save();

    res.json({
      success: true,
      data: entry
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: "Failed to save entry",
      details: err.message
    });
  }
});

/* 🟢 GET USER ENTRIES */
router.get("/entry", async (req, res) => {
  try {
    const entries = await Entry.find({
      userId: req.userId
    }).sort({ createdAt: -1 });

    res.json(entries);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 🟢 ANALYTICS */
router.get("/analytics", async (req, res) => {
  try {
    const entries = await Entry.find({
      userId: req.userId
    })
      .sort({ createdAt: 1 })
      .limit(30);

    const sentimentTrend = entries.map(e => ({
      date: e.createdAt?.toDateString(),
      score: e.sentimentScore
    }));

    const moodCount = {};
    const predictedMoodCount = {};

    entries.forEach(e => {
      moodCount[e.mood] = (moodCount[e.mood] || 0) + 1;
      predictedMoodCount[e.predictedMood] =
        (predictedMoodCount[e.predictedMood] || 0) + 1;
    });

    res.json({
      sentimentTrend,
      moodCount,
      predictedMoodCount
    });

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

/* 🟢 AWARENESS */
router.get("/awareness", async (req, res) => {
  try {
    const entries = await Entry.find({
      userId: req.userId
    });

    const total = entries.length;
    const aligned = entries.filter(e => !e.mismatch).length;

    const awarenessScore =
      total === 0 ? 0 : Math.round((aligned / total) * 100);

    res.json({
      awarenessScore,
      totalEntries: total,
      alignedEntries: aligned,
      mismatchedEntries: total - aligned
    });

  } catch (err) {
    res.status(500).json({ error: "Failed to calculate awareness" });
  }
});

/* 🟢 PERCEPTION ANALYSIS */
router.get("/perception-analysis", async (req, res) => {
  try {
    const entries = await Entry.find({
      userId: req.userId
    });

    const result = {};
    entries.forEach(e => {
      result[e.perceptionType] =
        (result[e.perceptionType] || 0) + 1;
    });

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: "Failed to analyze perception data" });
  }
});

module.exports = router;
