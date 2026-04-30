import { useEffect, useState } from "react";

export default function AwarenessCard() {
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("https://mental-backend-heru.onrender.com/api/awareness")
      .then(res => res.json())
      .then(data => {
        setScore(data.awarenessScore || 0);
        setTotal(data.totalEntries || 0);
      })
      .catch(() => {
        console.log("Error fetching awareness");
      });
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow text-center">

      <h2 className="text-xl font-semibold">
        Awareness Score
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        How aligned your mood and thoughts are
      </p>

      <div className="mt-4 text-4xl font-bold text-blue-600">
        {score}%
      </div>

      <p className="text-sm text-gray-400 mt-2">
        Based on {total} entries
      </p>

      <p className="mt-4 text-sm">
        {score > 75 && "Strong emotional awareness"}
        {score > 50 && score <= 75 && "Moderate awareness"}
        {score <= 50 && "Low awareness, reflect more"}
      </p>

    </div>
  );
}
