import { useState, useEffect } from "react";

export default function Journal() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("userId", userId);
    }
  }, []);

  const handleSubmit = async () => {
    if (!text || !mood) {
      setError("Please enter text and select mood");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const userId = localStorage.getItem("userId");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/entry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId
          },
          body: JSON.stringify({ text, mood }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setResult(data.data);
      setText("");
      setMood("");

    } catch {
      setError("Server issue, try again...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Journal</h1>

      <textarea
        className="w-full border p-3 rounded"
        rows="5"
        placeholder="Write your thoughts..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <select
        className="w-full mt-3 p-2 border rounded"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
      >
        <option value="">Select Mood</option>
        <option>Happy</option>
        <option>Neutral</option>
        <option>Sad</option>
        <option>Anxious</option>
        <option>Stressed</option>
      </select>

      <button
        onClick={handleSubmit}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
      >
        {loading ? "Saving..." : "Submit"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {result && (
        <div className="mt-5 p-4 border rounded bg-gray-50">
          <p><b>Entered:</b> {result.mood?.entered}</p>
          <p><b>Predicted:</b> {result.mood?.predicted}</p>
          <p><b>Score:</b> {result.analysis?.sentimentScore}</p>
          <p><b>Type:</b> {result.analysis?.perceptionType}</p>
          <p><b>Severity:</b> {result.analysis?.severity}</p>
        </div>
      )}
    </div>
  );
}
