import { useState } from "react";

export default function Journal() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [lastText, setLastText] = useState("");
  const [lastMood, setLastMood] = useState("");

  const handleSubmit = async () => {
    if (!text || !mood) {
      setError("Please write something and select a mood.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(
        "https://mental-backend-heru.onrender.com/api/entry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, mood }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data.data);
      setLastText(text);
      setLastMood(mood);

      setText("");
      setMood("");
    } catch (err) {
      setError("Server is waking up... please try again in a few seconds.");
    } finally {
      setLoading(false);
    }
  };
  const maskingQuotes = [
    "You don’t have to pretend to be okay all the time.",
    "Even silent struggles deserve to be heard.",
    "It’s okay to take off the mask and just feel.",
    "You’ve been strong for too long — rest is allowed.",
    "Not everyone sees your pain, but that doesn’t make it any less real.",
  ];

  const resilienceQuotes = [
    "Even in difficult moments, your strength is showing.",
    "You’re doing better than you think you are.",
    "Growth often hides inside tough days.",
    "You are stronger than what you’re going through.",
    "Every small step forward matters.",
  ];

  const alignedQuotes = [
    "You’re in tune with your emotions — that’s powerful.",
    "Self-awareness is a beautiful strength.",
    "You understand yourself, and that’s rare.",
    "Clarity in emotions brings peace.",
    "You’re handling things with honesty and balance.",
  ];
  const getRandomQuote = (quotes) => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  };
  const getInsight = () => {
    if (!result) return "";

    if (result.mismatch && result.perceptionType === "Masking Stress") {
      return "⚠ " + getRandomQuote(maskingQuotes);
    }

    if (result.mismatch && result.perceptionType === "Resilience") {
      return getRandomQuote(resilienceQuotes);
    }

    if (!result.mismatch) {
      return getRandomQuote(alignedQuotes);
    }

    return "Reflect more on your thoughts and feelings.";
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Daily Journal</h1>

      <div className="bg-white dark:bg-card shadow-xl rounded-2xl p-6 space-y-5 border">
        <textarea
          className="w-full p-4 rounded-xl bg-gray-50 border focus:ring-2 focus:ring-blue-500"
          rows="6"
          placeholder="Write about your day..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <select
          className="w-full p-3 rounded-xl bg-gray-50 border focus:ring-2 focus:ring-blue-500"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        >
          <option value="">Select your mood</option>
          <option value="Happy">Happy</option>
          <option value="Neutral">Neutral</option>
          <option value="Sad">Sad</option>
          <option value="Anxious">Anxious</option>
          <option value="Stressed">Stressed</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold"
        >
          {loading ? "Analyzing..." : "Save Entry"}
        </button>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </div>

      {result && (
        <div className="mt-8 bg-white shadow-xl rounded-2xl p-6 border">
          <h2 className="text-xl font-semibold mb-4">Analysis Result</h2>

          <div className="space-y-3 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Your Entry:</span>
              <p className="mt-1">{lastText}</p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                Entered Mood: {lastMood}
              </span>

              <span
                className={`px-3 py-1 rounded-full ${
                  result.mismatch
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                Alignment: {result.mismatch ? "Mismatch" : "Aligned"}
              </span>

              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                Perception Type: {result.perceptionType}
              </span>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-yellow-50 border text-yellow-800 text-sm">
              {getInsight()}
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            This is not a medical diagnosis. It is an AI-based reflection tool.
          </p>
        </div>
      )}
    </div>
  );
}
