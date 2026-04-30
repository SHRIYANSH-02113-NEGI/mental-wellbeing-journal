import { useEffect, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
);

export default function Dashboard() {
  const [trend, setTrend] = useState([]);
  const [mood, setMood] = useState({});
  const [stats, setStats] = useState({
    avg: 0,
    dominant: "",
    total: 0,
    types: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://mental-backend-heru.onrender.com/api/analytics")
      .then((res) => res.json())
      .then((data) => {
        const t = data.sentimentTrend || [];
        const rawMood = data.moodCount || {};

        const normalizedMood = {};
        Object.entries(rawMood).forEach(([key, value]) => {
          const cleanKey = key.toLowerCase();
          normalizedMood[cleanKey] =
            (normalizedMood[cleanKey] || 0) + value;
        });

        setTrend(t);
        setMood(normalizedMood);

        const avg =
          t.length > 0
            ? t.reduce((sum, i) => sum + i.score, 0) / t.length
            : 0;

        const dominant =
          Object.keys(normalizedMood).length > 0
            ? Object.keys(normalizedMood).reduce((a, b) =>
                normalizedMood[a] > normalizedMood[b] ? a : b,
              )
            : "none";

        setStats({
          avg: avg.toFixed(2),
          dominant: capitalize(dominant),
          total: t.length,
          types: Object.keys(normalizedMood).length,
        });

        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load dashboard");
        setLoading(false);
      });
  }, []);

  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = Math.floor((360 / count) * i);
      colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Mood Analytics</h1>
        <p className="text-gray-500">
          Track your emotional journey and discover patterns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Avg Sentiment" value={stats.avg} />
        <Card title="Dominant Mood" value={stats.dominant} />
        <Card title="Entries" value={stats.total} />
        <Card title="Mood Types" value={stats.types} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold">
            Sentiment Trend
          </h2>

          {trend.length === 0 ? (
            <p className="text-gray-400 mt-4">
              No data available
            </p>
          ) : (
            <Line
              data={{
                labels: trend.map((t) =>
                  new Date(t.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  }),
                ),
                datasets: [
                  {
                    label: "Sentiment",
                    data: trend.map((t) => t.score),
                    borderColor: "#4f46e5",
                    backgroundColor: "rgba(79,70,229,0.2)",
                    tension: 0.4,
                    fill: true,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "bottom" },
                },
                scales: {
                  y: { min: -1, max: 1 },
                },
              }}
            />
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold">
            Mood Distribution
          </h2>

          {Object.keys(mood).length === 0 ? (
            <p className="text-gray-400 mt-4">
              No data available
            </p>
          ) : (
            <Doughnut
              data={{
                labels: Object.keys(mood).map(capitalize),
                datasets: [
                  {
                    data: Object.values(mood),
                    backgroundColor: generateColors(
                      Object.keys(mood).length,
                    ),
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: { position: "bottom" },
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
