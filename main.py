from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv
import os
import httpx
from groq import Groq
from sentence_transformers import SentenceTransformer

load_dotenv()

app = FastAPI()

CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
REDIRECT_URI = "http://localhost:8000/auth/callback"
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

@app.get("/")
def home():
    return {"message": "CodeMind AI backend is running!"}

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "github_configured": CLIENT_ID is not None
    }

@app.get("/login")
def login():
    github_auth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&scope=repo"
    )
    return RedirectResponse(github_auth_url)

@app.get("/auth/callback")
async def auth_callback(code: str):
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "code": code,
                "redirect_uri": REDIRECT_URI,
            },
            headers={"Accept": "application/json"},
        )
        token_data = token_response.json()
        access_token = token_data.get("access_token")

        repos_response = await client.get(
            "https://api.github.com/user/repos",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        repos_data = repos_response.json()

    repo_names = [repo["name"] for repo in repos_data]

    return {
        "message": "Login successful!",
        "access_token": access_token,
        "your_repos": repo_names
    }

@app.get("/repo-files")
async def get_repo_files(owner: str, repo: str, token: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.github.com/repos/{owner}/{repo}/contents/",
            headers={"Authorization": f"token {token}"},
        )
        files_data = response.json()

    files_list = [
        {"name": item["name"], "type": item["type"], "path": item["path"]}
        for item in files_data
    ]

    return {"repo": repo, "files": files_list}
@app.get("/file-content")
async def get_file_content(owner: str, repo: str, path: str, token: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.github.com/repos/{owner}/{repo}/contents/{path}",
            headers={"Authorization": f"token {token}"},
        )
        file_data = response.json()

    import base64
    encoded_content = file_data.get("content", "")
    decoded_content = base64.b64decode(encoded_content).decode("utf-8")

    return {
        "file": file_data.get("name"),
        "content": decoded_content
    }
@app.get("/analyze-code")
async def analyze_code(owner: str, repo: str, path: str, token: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.github.com/repos/{owner}/{repo}/contents/{path}",
            headers={"Authorization": f"token {token}"},
        )
        file_data = response.json()

    import base64
    encoded_content = file_data.get("content", "")
    code_content = base64.b64decode(encoded_content).decode("utf-8")

    prompt = f"""You are a senior software engineer reviewing code.
Analyze the following code and provide:
1. A brief explanation of what it does
2. Any bugs or issues you find
3. Suggestions for improvement

Code:
{code_content}
"""

    chat_completion = groq_client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
    )

    ai_response = chat_completion.choices[0].message.content

    return {
        "file": file_data.get("name"),
        "ai_analysis": ai_response
    }
@app.get("/generate-tests")
async def generate_tests(owner: str, repo: str, path: str, token: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.github.com/repos/{owner}/{repo}/contents/{path}",
            headers={"Authorization": f"token {token}"},
        )
        file_data = response.json()

    import base64
    encoded_content = file_data.get("content", "")
    code_content = base64.b64decode(encoded_content).decode("utf-8")

    prompt = f"""You are a senior software engineer who writes high-quality unit tests.
Given the following code, write unit tests that cover the main functions and edge cases.
Use an appropriate testing framework based on the language of the code.
Only return the test code, with brief comments explaining each test.

Code:
{code_content}
"""

    chat_completion = groq_client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
    )

    ai_response = chat_completion.choices[0].message.content

    return {
        "file": file_data.get("name"),
        "generated_tests": ai_response
    }
@app.get("/chunk-and-embed")
async def chunk_and_embed(owner: str, repo: str, path: str, token: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.github.com/repos/{owner}/{repo}/contents/{path}",
            headers={"Authorization": f"token {token}"},
        )
        file_data = response.json()

    import base64
    encoded_content = file_data.get("content", "")
    code_content = base64.b64decode(encoded_content).decode("utf-8")

    # Split code into chunks of ~500 characters each
    chunk_size = 500
    chunks = [
        code_content[i:i + chunk_size]
        for i in range(0, len(code_content), chunk_size)
    ]

    # Convert each chunk into an embedding (list of numbers)
    embeddings = embedding_model.encode(chunks)

    return {
        "file": file_data.get("name"),
        "total_chunks": len(chunks),
        "first_chunk_preview": chunks[0] if chunks else "",
        "embedding_size": len(embeddings[0]) if len(embeddings) > 0 else 0
    }