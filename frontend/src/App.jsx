import { useState } from "react";
import History from "./History";
import CodeReview from "./CodeReview";
import "./App.css";

function App() {
  const [page, setPage] = useState("search");
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

  return (
    <div className="container">
      <div className="header">
        <h1>🧠 CodeMind AI</h1>
        <p className="subtitle">Your AI-powered senior engineer — reviews code, generates tests, answers questions</p>
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
              {loading ? <><span className="spinner"></span>Thinking...</> : "Ask"}
            </button>
          </div>

          {answer && (
            <div className="answer-box">
              <h3>Answer:</h3>
              <p>{answer}</p>
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