import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/history")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data.history);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="container"><p>Loading history...</p></div>;

  return (
    <div className="container">
      <h1>🧠 CodeMind AI</h1>
      <h2 className="page-title">Query History</h2>
      {history.length === 0 ? (
        <p>No history yet. Ask a question first!</p>
      ) : (
        history.map((entry) => (
          <div className="history-card" key={entry.id}>
            <p className="history-query">❓ {entry.query}</p>
            <div className="history-answer">
              <ReactMarkdown>{entry.answer}</ReactMarkdown>
            </div>
            <p className="history-date">
              {new Date(entry.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default History;