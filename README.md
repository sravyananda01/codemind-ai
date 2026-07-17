# 🧠 CodeMind AI

**An AI-powered code review platform that understands your entire GitHub repository like a senior engineer.**

🌐 **[Live Demo → codemind-ai-rosy.vercel.app](https://codemind-ai-rosy.vercel.app)**

> Built by a 3rd-year CSE (AI & ML) student — not a tutorial project. Every line written from scratch.



![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)




![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)




![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)




![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)



---

## ✨ What Can It Do?

| Feature | Description |
|---|---|
| 🔍 **Ask Your Codebase** | Type a plain-English question, get an answer backed by your actual code |
| 🛠️ **AI Code Review** | Detects bugs, security issues, and suggests improvements |
| 🧪 **Unit Test Generator** | Auto-generates unit tests with edge cases for any file |
| 📜 **Query History** | Every interaction saved to PostgreSQL with timestamps |
| 🔐 **GitHub OAuth Login** | Secure login with your real GitHub account |

---

## 🏗️ System Architecture

```
User → GitHub OAuth Login
           ↓
   GitHub API (fetch repo files)
           ↓
   Code Chunking (500 char chunks)
           ↓
   Sentence Transformers (embeddings)
           ↓
   Qdrant Cloud (vector storage + semantic search)
           ↓
   Groq LLM — Llama 3.3 70B (analysis + answers)
           ↓
   FastAPI Backend ←→ PostgreSQL (history)
           ↓
   React Dashboard (Search | Code Review | History)
```

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** — high-performance Python web framework
- **Groq API** — Llama 3.3 70B for AI analysis (free, fast inference)
- **Sentence Transformers** — `all-MiniLM-L6-v2` for code embeddings
- **Qdrant Cloud** — vector database for semantic search
- **PostgreSQL + SQLAlchemy** — storing query history
- **GitHub OAuth 2.0** — secure authentication

### Frontend
- **React + Vite** — fast, modern UI framework
- **React Markdown** — renders AI responses with proper formatting
- Custom dark theme with purple branding

---

## 🚀 How It Works (The RAG Pipeline)

1. User logs in with GitHub OAuth
2. Selects a repo → files are fetched via GitHub API
3. Code is split into chunks → converted to vector embeddings
4. Embeddings stored in Qdrant Cloud vector database
5. User asks a question → question converted to embedding
6. Qdrant finds the 3 most similar code chunks (semantic search)
7. Those chunks + the question are sent to Llama 3.3 70B
8. AI gives a grounded, accurate answer based on real code
9. Answer displayed in React dashboard + saved to PostgreSQL

---

## ⚙️ Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/sravyananda01/codemind-ai.git
cd codemind-ai
```

### 2. Backend setup
```bash
# Create virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn python-dotenv httpx groq sentence-transformers qdrant-client sqlalchemy psycopg2-binary authlib

# Create .env file with your keys
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GROQ_API_KEY=your_groq_api_key
QDRANT_URL=your_qdrant_cluster_url
QDRANT_API_KEY=your_qdrant_api_key
DATABASE_URL=postgresql://postgres:password@localhost:5432/codemind_db

# Run backend
uvicorn main:app --reload
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 🔌 API Reference

| Endpoint | Description |
|---|---|
| `GET /login` | Redirect to GitHub OAuth |
| `GET /auth/callback` | Handle OAuth callback, return token |
| `GET /repo-files` | List all files in a GitHub repo |
| `GET /file-content` | Fetch raw content of a file |
| `GET /analyze-code` | AI code review for a file |
| `GET /generate-tests` | Auto-generate unit tests |
| `GET /index-repo-file` | Chunk, embed, store in Qdrant |
| `GET /search-code` | Semantic search over indexed code |
| `GET /ask-repo` | RAG-powered Q&A over codebase |
| `GET /history` | Fetch all past queries from PostgreSQL |

---

## 💡 Engineering Decisions & What I Learned

- **Why RAG over simple prompting?** — LLMs have token limits. Sending an entire codebase directly is impossible. RAG lets us retrieve only the relevant chunks, making it scalable.
- **Why Qdrant over ChromaDB?** — Qdrant Cloud offers a free hosted tier, meaning zero infrastructure setup. Better for a portfolio project that needs a live demo.
- **Why Groq over OpenAI?** — Groq offers free, extremely fast inference for Llama 3.3 70B. No credit card needed, perfect for student projects.
- **Why sentence-transformers `all-MiniLM-L6-v2`?** — Lightweight (80MB), runs locally with no API cost, produces 384-dimensional embeddings good enough for code similarity.

---

## 👩‍💻 About the Author

**Sravya Nanda**  
3rd Year B.Tech CSE (AI & ML) — Pragati Engineering College  
Targeting Software Engineer & AI/ML Engineer roles

[

![GitHub](https://img.shields.io/badge/GitHub-sravyananda01-black?style=flat&logo=github)

](https://github.com/sravyananda01)
[

![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat&logo=linkedin)

](https://www.linkedin.com/in/sravyananda)

---

> *"Every developer deserves a senior engineer reviewing their code. CodeMind AI makes that possible for everyone."*