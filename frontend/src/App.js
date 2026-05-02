import { useState, useEffect } from "react";
import Journal from "./pages/Journal";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";

const PAGES = {
  JOURNAL: "journal",
  DASHBOARD: "dashboard",
  HISTORY: "history"
};

function App() {
  const [page, setPage] = useState(PAGES.JOURNAL);
  const [dark, setDark] = useState(false);

  // Load theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDark(true);
  }, []);

  // Apply theme
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-background text-gray-900 dark:text-gray-100">
      <nav className="flex justify-between items-center px-6 py-4 bg-white dark:bg-card shadow">
        <div className="flex gap-6 font-semibold">
          <button
            onClick={() => setPage(PAGES.JOURNAL)}
            className={page === PAGES.JOURNAL ? "text-indigo-500" : ""}
          >
            Journal
          </button>

          <button
            onClick={() => setPage(PAGES.DASHBOARD)}
            className={page === PAGES.DASHBOARD ? "text-indigo-500" : ""}
          >
            Dashboard
          </button>

          <button
            onClick={() => setPage(PAGES.HISTORY)}
            className={page === PAGES.HISTORY ? "text-indigo-500" : ""}
          >
            History
          </button>
        </div>

        <button
          onClick={() => setDark(!dark)}
          className="px-3 py-1 rounded bg-indigo-500 text-white"
        >
          {dark ? "Light" : "Dark"}
        </button>
      </nav>

      {page === PAGES.JOURNAL && <Journal />}
      {page === PAGES.DASHBOARD && <Dashboard />}
      {page === PAGES.HISTORY && <History />}
    </div>
  );
}

export default App;
