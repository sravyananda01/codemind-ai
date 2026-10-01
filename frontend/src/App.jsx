import { useState } from "react";
import ReactMarkdown from "react";
import remarkGfm from "remark-gfm";
import Landing from "./Landing";
import History from "./History";
import CodeReview from "./CodeReview";
import "./App.css";


function App() {
  const [page, setPage] = useState("landing");
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askRepo = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setAnswer("");
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/ask-repo?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      setAnswer("Error connecting to backend. Make sure it's running.");
    }
    setLoading(false);
  };

  if (page === "landing") {
    return <Landing onEnter={() => setPage("search")} />;
  }

  return (
    <div className="container">
      <div className="header">
        <h1 onClick={() => setPage("landing")} style={{ cursor: "pointer" }}>
          🧠 CodeMind AI
        </h1>
        <p className="subtitle">
          Your AI-powered senior engineer — reviews code, generates tests,
          answers questions
        </p>
      </div>

      <div className="nav">
        <button
          className={page === "search" ? "active" : ""}
          onClick={() => setPage("search")}
        >
          🔍 Search
        </button>
        <button
          className={page === "review" ? "active" : ""}
          onClick={() => setPage("review")}
        >
          🛠️ Code Review
        </button>
        <button
          className={page === "history" ? "active" : ""}
          onClick={() => setPage("history")}
        >
          📜 History
        </button>
      </div>

      {page === "search" && (
        <>
          <div className="search-box">
            <input
              type="text"
              placeholder="e.g. how does the cart checkout work?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askRepo()}
            />
            <button onClick={askRepo} disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>Thinking...
                </>
              ) : (
                "Ask"
              )}
            </button>
          </div>

          {answer && (
            <div className="answer-box">
              <h3>Answer:</h3>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
            </div>
          )}
        </>
      )}
      {page === "review" && <CodeReview />}
      {page === "history" && <History />}
    </div>
  );
}

export default App;