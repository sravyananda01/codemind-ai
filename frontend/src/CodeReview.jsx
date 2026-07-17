import { useState } from "react";

function CodeReview() {
  const [owner, setOwner] = useState("sravyananda01");
  const [repo, setRepo] = useState("");
  const [path, setPath] = useState("");
  const [token, setToken] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("review");

  const analyze = async () => {
    if (!repo || !path || !token) {
      setResult("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setResult("");
    const endpoint = mode === "review" ? "analyze-code" : "generate-tests";
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/${endpoint}?owner=${owner}&repo=${repo}&path=${path}&token=${token}`
      );
      const data = await response.json();
      setResult(mode === "review" ? data.ai_analysis : data.generated_tests);
    } catch (error) {
      setResult("Error connecting to backend.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="mode-toggle">
        <button
          className={mode === "review" ? "active" : ""}
          onClick={() => setMode("review")}
        >
          🔍 Code Review
        </button>
        <button
          className={mode === "tests" ? "active" : ""}
          onClick={() => setMode("tests")}
        >
          🧪 Generate Tests
        </button>
      </div>

      <div className="form-box">
        <input
          type="text"
          placeholder="GitHub username"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
        <input
          type="text"
          placeholder="Repo name (e.g. ecommerce-web-application)"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
        />
        <input
          type="text"
          placeholder="File path (e.g. script.js)"
          value={path}
          onChange={(e) => setPath(e.target.value)}
        />
        <input
          type="text"
          placeholder="GitHub access token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button onClick={analyze} disabled={loading}>
          {loading ? "Analyzing..." : mode === "review" ? "Review Code" : "Generate Tests"}
        </button>
      </div>

      {result && (
        <div className="answer-box">
          <h3>{mode === "review" ? "Code Review:" : "Generated Tests:"}</h3>
          <pre className="code-output">{result}</pre>
        </div>
      )}
    </div>
  );
}

export default CodeReview;