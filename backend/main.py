
import os
from pathlib import Path
from uuid import uuid4

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from analytics import (
    load_and_process_history,
    get_summary,
    get_top_series,
    get_top_movies,
    get_viewing_by_day,
    get_viewing_by_month,
    get_streak_info,
    get_genre_counts,
    get_insights,
    get_binge_info,
)

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

sessions = {}

app = FastAPI(title="Netflix Wrapped API", version="1.0.0")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
}
extra_origins = os.getenv("CORS_ORIGINS", "")
for origin in extra_origins.split(","):
    origin = origin.strip()
    if origin:
        origins.add(origin)

frontend_url = os.getenv("FRONTEND_URL", "").strip()
if frontend_url:
    origins.add(frontend_url.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_session(session_id: str):
    if not session_id:
        raise HTTPException(status_code=400, detail="Missing session_id.")
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="No analysis found for this session.")
    return sessions[session_id]


@app.get("/")
def root():
    return {"message": "Netflix Wrapped API is running."}


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/upload")
async def upload_csv(session_id: str, file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Please upload a CSV file.")

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="CSV is too large. Maximum size is 10 MB.")

    safe_session = "".join(ch for ch in session_id if ch.isalnum() or ch in "-_" )[:120]
    if not safe_session:
        raise HTTPException(status_code=400, detail="Invalid session_id.")

    path = UPLOAD_DIR / f"{safe_session}.csv"
    path.write_bytes(content)

    try:
        df = load_and_process_history(path)
    except Exception as exc:
        path.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    if df.empty:
        path.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail="No valid viewing records were found in the CSV.")

    sessions[session_id] = df
    return {"message": "CSV uploaded successfully.", "summary": get_summary(df)}


@app.delete("/api/clear")
@app.post("/api/clear")
def clear_session(session_id: str):
    sessions.pop(session_id, None)
    (UPLOAD_DIR / f"{session_id}.csv").unlink(missing_ok=True)
    return {"message": "Session cleared."}


@app.get("/api/summary")
def summary(session_id: str):
    return get_summary(get_session(session_id))


@app.get("/api/top-series")
def top_series(session_id: str):
    return get_top_series(get_session(session_id))


@app.get("/api/top-movies")
def top_movies(session_id: str):
    return get_top_movies(get_session(session_id))


@app.get("/api/viewing-by-day")
def viewing_by_day(session_id: str):
    return get_viewing_by_day(get_session(session_id))


@app.get("/api/viewing-by-month")
def viewing_by_month(session_id: str):
    return get_viewing_by_month(get_session(session_id))


@app.get("/api/streak")
def streak(session_id: str):
    return get_streak_info(get_session(session_id))


@app.get("/api/genres")
def genres(session_id: str):
    return get_genre_counts(get_session(session_id))


@app.get("/api/insights")
def insights(session_id: str):
    return get_insights(get_session(session_id))


@app.get("/api/binge")
def binge(session_id: str):
    return get_binge_info(get_session(session_id))
