import { useState, useEffect } from "react";
import { Loader2, Sparkles, Send, BookHeart, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Mood = "Happy" | "Neutral" | "Sad" | "Anxious" | "Stressed";

interface AnalysisResult {
  mood?: { predicted?: string };
  analysis?: {
    mismatch?: boolean;
    perceptionType?: string;
    severity?: string;
  };
}

const MOODS: { label: Mood; emoji: string; tone: string }[] = [
  { label: "Happy", emoji: "😊", tone: "bg-mood-happy/15 text-foreground border-mood-happy/40 hover:bg-mood-happy/25" },
  { label: "Neutral", emoji: "😐", tone: "bg-mood-neutral/15 text-foreground border-mood-neutral/40 hover:bg-mood-neutral/25" },
  { label: "Sad", emoji: "😔", tone: "bg-mood-sad/15 text-foreground border-mood-sad/40 hover:bg-mood-sad/25" },
  { label: "Anxious", emoji: "😟", tone: "bg-mood-anxious/15 text-foreground border-mood-anxious/40 hover:bg-mood-anxious/25" },
  { label: "Stressed", emoji: "😣", tone: "bg-mood-stressed/15 text-foreground border-mood-stressed/40 hover:bg-mood-stressed/25" },
];

export default function Journal() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState<Mood | "">("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [lastText, setLastText] = useState("");
  const [lastMood, setLastMood] = useState("");

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = "user_" + Math.random().toString(36).slice(2, 11);
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
      const userId = localStorage.getItem("userId") ?? "";
      const apiUrl = import.meta.env.VITE_API_URL ?? "";
      const res = await fetch(`${apiUrl}/entry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ text, mood }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data.data);
      setLastText(text);
      setLastMood(mood);
      setText("");
      setMood("");
    } catch {
      setError("Server is waking up… try again in a few seconds.");
    } finally {
      setLoading(false);
    }
  };

  const getInsight = () => {
    if (!result) return "";
    const mismatch = result.analysis?.mismatch;
    const type = result.analysis?.perceptionType;
    if (mismatch && type === "Masking Stress") return "You may be hiding stress. Take a breath and reflect gently.";
    if (mismatch && type === "Resilience") return "You're stronger than you feel right now. Keep going.";
    if (!mismatch) return "You're aligned with your emotions — that's a beautiful place to be.";
    return "Reflect a little more on what's underneath your thoughts.";
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-float" />
      <div className="pointer-events-none absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-accent/20 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="relative max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/70 backdrop-blur border shadow-soft mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium tracking-wide text-muted-foreground">MINDFUL JOURNALING</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight mb-4">
            Today's <span className="text-gradient italic">reflection</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            Write freely. We'll quietly listen for what your words reveal beneath the surface.
          </p>
        </header>

        {/* Composer */}
        <section className="bg-gradient-card backdrop-blur rounded-3xl p-6 sm:p-8 border shadow-elegant animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookHeart className="w-4 h-4 text-primary" />
              <span>{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</span>
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">{wordCount} words</span>
          </div>

          <textarea
            className="w-full p-5 rounded-2xl bg-background/60 border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-smooth resize-none text-foreground placeholder:text-muted-foreground/70 leading-relaxed"
            rows={7}
            placeholder="What's on your mind today? Let it flow…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="mt-6">
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase mb-3">How do you feel?</p>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => setMood(m.label)}
                  className={cn(
                    "px-4 py-2.5 rounded-full border text-sm font-medium transition-smooth flex items-center gap-2",
                    mood === m.label
                      ? "bg-foreground text-background border-foreground shadow-elegant scale-105"
                      : cn("bg-card", m.tone)
                  )}
                >
                  <span className="text-base">{m.emoji}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={cn(
              "mt-7 w-full py-4 rounded-2xl bg-gradient-hero text-primary-foreground font-medium shadow-elegant hover:shadow-glow transition-smooth flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed",
              !loading && "hover:scale-[1.01] active:scale-[0.99]"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Listening to your words…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Save & analyze
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm animate-fade-up">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </section>

        {/* Result */}
        {result && (
          <section className="mt-8 bg-gradient-card backdrop-blur rounded-3xl p-6 sm:p-8 border shadow-elegant animate-fade-up">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center animate-pulse-glow">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-semibold">What we noticed</h2>
            </div>

            <blockquote className="border-l-2 border-primary/40 pl-4 italic text-muted-foreground leading-relaxed mb-6">
              "{lastText}"
            </blockquote>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <Stat label="You felt" value={lastMood} />
              <Stat label="We sensed" value={result.mood?.predicted ?? "—"} accent />
              <Stat label="Pattern" value={result.analysis?.perceptionType ?? "—"} />
              <Stat label="Intensity" value={result.analysis?.severity ?? "—"} />
            </div>

            <div
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium",
                result.analysis?.mismatch
                  ? "bg-warning/10 text-warning-foreground border-warning/30"
                  : "bg-success/10 text-success border-success/30"
              )}
            >
              {result.analysis?.mismatch ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              {result.analysis?.mismatch ? "Some mismatch detected" : "Aligned with your feelings"}
            </div>

            <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
              <p className="text-xs font-semibold tracking-wider text-primary uppercase mb-2">Gentle insight</p>
              <p className="text-foreground leading-relaxed">{getInsight()}</p>
            </div>
          </section>
        )}

        <footer className="text-center mt-12 text-xs text-muted-foreground">
          Your thoughts stay yours. Written with care.
        </footer>
      </div>
    </main>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={cn(
      "p-3 rounded-xl border bg-background/40",
      accent && "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20"
    )}>
      <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase mb-1">{label}</p>
      <p className="text-sm font-medium truncate">{value}</p>
    </div>
  );
}
