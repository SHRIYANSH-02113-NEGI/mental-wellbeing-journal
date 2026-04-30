import { useState, useEffect } from "react";
import Journal from "./pages/Journal";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";

function App() {
  const [page, setPage] = useState("journal");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-background text-gray-900 dark:text-gray-100">
      <nav className="flex justify-between items-center px-6 py-4 bg-white dark:bg-card shadow">
        <div className="flex gap-6 font-semibold">
          <button onClick={() => setPage("journal")}>Journal</button>

          <button onClick={() => setPage("dashboard")}>Dashboard</button>

          <button onClick={() => setPage("history")}>History</button>
        </div>

        <button
          onClick={() => setDark(!dark)}
          className="px-3 py-1 rounded bg-indigo-500 text-white"
        >
          {dark ? "Light" : "Dark"}
        </button>
      </nav>

      {page === "journal" && <Journal />}
      {page === "dashboard" && <Dashboard />}
      {page === "history" && <History />}
    </div>
  );
}

export default App;
