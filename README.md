# Netflix Wrapped — Complete App

A full-stack Netflix Wrapped prototype:

- Frontend: React + Vite
- Backend: FastAPI + pandas
- Frontend deployment: Vercel
- Backend deployment: Render (or any Python host)

## 1. Run locally

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend: http://127.0.0.1:8000

### Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend: Vite will print the local URL, normally http://localhost:5173 or 5174.

## 2. CSV format

Your Netflix viewing-history export must contain:

```csv
Title,Date
Friends: Season 4: The One with the Embryos,09/16/26
Dune,07/26/26
```

## 3. Production deployment

### Backend

Render build command:

```bash
pip install -r requirements.txt
```

Render start command:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Set:

```text
FRONTEND_URL=https://YOUR-VERCEL-DOMAIN.vercel.app
```

### Frontend

Vercel project root: `frontend`

Environment variable:

```text
VITE_API_URL=https://YOUR-BACKEND.onrender.com
```

Redeploy after changing the environment variable.

## Important prototype note

Sessions are stored in memory and uploaded CSVs are stored on the backend filesystem. This is suitable for a small prototype/demo. A production app should use authenticated sessions and persistent object storage/database storage.
