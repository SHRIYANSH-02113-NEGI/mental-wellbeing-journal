import { useEffect, useState } from "react";

export default function History() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // ✅ ensure userId exists
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("userId", userId);
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/entry`, // ✅ FIXED
          {
            headers: {
              "x-user-id": userId // ✅ IMPORTANT
            }
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await res.json();

        // backend returns array directly
        setEntries(data || []);

      } catch (err) {
        setError("Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading history...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        {error}
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Journal History
      </h1>

      {entries.length === 0 ? (
        <p className="text-gray-500 text-center">
          No entries yet
        </p>
      ) : (
        <div className="space-y-5">
          {entries.map((e) => (
            <div
              key={e._id}
              className="p-5 rounded-2xl shadow-lg bg-white border hover:shadow-xl transition"
            >
              {/* Date */}
              <p className="text-xs text-gray-400">
                {new Date(e.createdAt).toLocaleString()}
              </p>

              {/* Text */}
              <p className="mt-2 text-gray-800">
                {e.content?.text}
              </p>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2 text-sm">

                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  Entered: {e.mood?.entered}
                </span>

                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  Predicted: {e.mood?.predicted}
                </span>

                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                  Score: {e.analysis?.sentimentScore?.toFixed(2) || "N/A"}
                </span>

                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                  Type: {e.analysis?.perceptionType || "N/A"}
                </span>

                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                  Severity: {e.analysis?.severity || "N/A"}
                </span>

                <span className={`px-3 py-1 rounded-full ${
                  e.analysis?.mismatch
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}>
                  {e.analysis?.mismatch ? "Mismatch" : "Aligned"}
                </span>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
