import { useState, useEffect } from "react";

export default function Journal() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [lastText, setLastText] = useState("");
  const [lastMood, setLastMood] = useState("");

  // ✅ ensure userId exists
  useEffect(() => {
    let userId = localStorage.getItem("userId");

    if (!userId) {
      userId = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("userId", userId);
    }
  }, []);

  const handleSubmit = async () => {
    if (!text || !mood) {
      setError("Please write something and select a mood.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const userId = localStorage.getItem("userId");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/entry`, // ✅ FIXED
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId // ✅ IMPORTANT
          },
          body: JSON.stringify({ text, mood }),
        }
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
      setError("Server is waking up... try again in a few seconds.");
    } finally {
      setLoading(false);
    }
  };

  /* 🔥 Insight Logic (UPDATED FOR NEW STRUCTURE) */

  const getInsight = () => {
    if (!result) return "";

    const mismatch = result.analysis?.mismatch;
    const type = result.analysis?.perceptionType;

    if (mismatch && type === "Masking Stress") {
      return "⚠ You may be hiding stress. Take a moment to reflect.";
    }

    if (mismatch && type === "Resilience") {
      return "You're stronger than you feel. Keep going.";
    }

    if (!mismatch) {
      return "You're aligned with your emotions. That's great.";
    }

    return "Reflect more on your thoughts.";
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Daily Journal
      </h1>

      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-5 border">
        
        <textarea
          className="w-full p-4 rounded-xl bg-gray-50 border"
          rows="6"
          placeholder="Write about your day..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <select
          className="w-full p-3 rounded-xl bg-gray-50 border"
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
          className="w-full py-3 rounded-xl bg-indigo-600 text-white"
        >
          {loading ? "Analyzing..." : "Save Entry"}
        </button>

        {error && (
          <p className="text-red-500 text-center">{error}</p>
        )}
      </div>

      {result && (
        <div className="mt-8 bg-white shadow-xl rounded-2xl p-6 border">
          <h2 className="text-xl font-semibold mb-4">
            Analysis Result
          </h2>

          <div className="space-y-3 text-sm">

            <div>
              <b>Your Entry:</b>
              <p>{lastText}</p>
            </div>

            <div className="flex flex-wrap gap-2">

              <span className="bg-blue-100 px-3 py-1 rounded">
                Entered: {lastMood}
              </span>

              <span className="bg-green-100 px-3 py-1 rounded">
                Predicted: {result.mood?.predicted}
              </span>

              <span className="bg-purple-100 px-3 py-1 rounded">
                Type: {result.analysis?.perceptionType}
              </span>

              <span className="bg-yellow-100 px-3 py-1 rounded">
                Severity: {result.analysis?.severity}
              </span>

              <span className={`px-3 py-1 rounded ${
                result.analysis?.mismatch
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}>
                {result.analysis?.mismatch ? "Mismatch" : "Aligned"}
              </span>

            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded">
              {getInsight()}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
