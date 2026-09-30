import { useEffect, useState } from "react";
import "./Landing.css";

const TYPING_LINES = [
  { role: "user", text: "Review my checkout function" },
  { role: "ai", text: "Found 3 critical issues: ① No payment validation ② Cart not cleared on failure ③ Missing error boundary. Here's the fix..." },
  { role: "user", text: "Generate unit tests for cart.js" },
  { role: "ai", text: "Generated 8 Jest tests covering addToCart(), removeFromCart(), checkout() with edge cases for empty cart and duplicate items." },
];

function TypingTerminal() {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayed, setDisplayed] = useState([]);
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    if (lineIndex >= TYPING_LINES.length) return;
    const line = TYPING_LINES[lineIndex];
    if (charIndex < line.text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prev) => prev + line.text[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 28);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayed((prev) => [...prev, { role: line.role, text: line.text }]);
        setCurrentText("");
        setCharIndex(0);
        setLineIndex((prev) => prev + 1);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [lineIndex, charIndex]);

  const currentLine = lineIndex < TYPING_LINES.length ? TYPING_LINES[lineIndex] : null;

  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="t-dots">
          <span className="t-dot red"></span>
          <span className="t-dot yellow"></span>
          <span className="t-dot green"></span>
        </div>
        <span className="t-title">codemind-ai — analysis</span>
      </div>
      <div className="terminal-body">
        {displayed.map((line, i) => (
          <div key={i} className={`t-line ${line.role}`}>
            <span className="t-role">{line.role === "user" ? "❯ you" : "🧠 ai"}</span>
            <p>{line.text}</p>
          </div>
        ))}
        {currentLine && (
          <div className={`t-line ${currentLine.role}`}>
            <span className="t-role">{currentLine.role === "user" ? "❯ you" : "🧠 ai"}</span>
            <p>{currentText}<span className="cursor">▋</span></p>
          </div>
        )}
      </div>
    </div>
  );
}

function Landing({ onEnter }) {
  return (
    <div className="landing-wrap">
      <nav className="landing-nav">
        <span className="nav-logo">🧠 CodeMind AI</span>
        <button className="nav-cta" onClick={onEnter}>Launch App →</button>
      </nav>

      <div className="hero">
        <div className="hero-left">
          <div className="eyebrow">RAG · LLM · Vector Search · GitHub OAuth</div>

          <h1 className="hero-title">
            The AI that reads
            <br />
            your code like a
            <br />
            <span className="hero-highlight">senior engineer</span>
          </h1>

          <p className="hero-body">
            Connect any GitHub repo. Ask questions in plain English.
            Get instant code reviews, bug reports, and unit tests —
            powered by Llama 3.3 70B and semantic search over your entire codebase.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={onEnter}>
              Try it free →
            </button>
            <a
              href="https://github.com/sravyananda01/codemind-ai"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              ★ View on GitHub
            </a>
          </div>

          <div className="stats-row">
            <div className="stat">
              <span className="stat-num">5</span>
              <span className="stat-label">AI Features</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-num">384</span>
              <span className="stat-label">Vector Dimensions</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-num">70B</span>
              <span className="stat-label">Parameter Model</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="glow-ring"></div>
          <TypingTerminal />
        </div>
      </div>

      <div className="features-section">
        <p className="features-label">WHAT IT CAN DO</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="f-icon">🔍</div>
            <h3>Ask Your Codebase</h3>
            <p>Type any question in plain English. The RAG pipeline retrieves relevant code chunks and grounds the AI's answer in your actual code.</p>
          </div>
          <div className="feature-card">
            <div className="f-icon">🛠️</div>
            <h3>AI Code Review</h3>
            <p>Detects bugs, security vulnerabilities, and anti-patterns. Gets specific — not generic advice, but issues found in your actual file.</p>
          </div>
          <div className="feature-card">
            <div className="f-icon">🧪</div>
            <h3>Unit Test Generator</h3>
            <p>Automatically writes Jest or pytest unit tests with edge cases for any file. Covers the cases you'd miss at 2am.</p>
          </div>
          <div className="feature-card">
            <div className="f-icon">📜</div>
            <h3>Query History</h3>
            <p>Every interaction saved to PostgreSQL. Review past analyses, track recurring issues, and build institutional knowledge.</p>
          </div>
        </div>
      </div>

      <div className="stack-section">
        <p className="features-label">BUILT WITH</p>
        <div className="stack-row">
          {["FastAPI", "React + Vite", "Qdrant Cloud", "Llama 3.3 70B", "PostgreSQL", "Sentence Transformers", "GitHub OAuth 2.0"].map((t) => (
            <span key={t} className="stack-tag">{t}</span>
          ))}
        </div>
      </div>

      <div className="landing-footer">
        <p>Built by <a href="https://www.linkedin.com/in/sravyananda" target="_blank" rel="noreferrer">Sravya Nanda</a> · 3rd Year CSE (AI & ML) · Pragati Engineering College</p>
        <a href="https://github.com/sravyananda01/codemind-ai" target="_blank" rel="noreferrer">GitHub →</a>
      </div>
    </div>
  );
}

export default Landing;