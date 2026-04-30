import { useEffect, useState } from "react";

export default function History() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://mental-backend-heru.onrender.com/api/entry")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data?.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load history");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500">Loading history...</p>
    );
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Journal History</h1>

      {entries.length === 0 ? (
        <p className="text-gray-500 text-center">No entries yet</p>
      ) : (
        <div className="space-y-5">
          {entries.map((e) => (
            <div
              key={e._id}
              className="p-5 rounded-2xl shadow-lg bg-white dark:bg-card border hover:shadow-xl transition"
            >
              <p className="text-xs text-gray-400">
                {new Date(e.createdAt).toLocaleString()}
              </p>

              <p className="mt-2 text-gray-800 dark:text-gray-200">{e.text}</p>

              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  Entered Mood: {e.mood}
                </span>

                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                  Sentiment Score: {e.sentimentScore?.toFixed(2)}
                </span>

                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                  Perception Type: {e.perceptionType}
                </span>

                {e.mismatch && (
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full">
                    ⚠ Mismatch Detected
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
