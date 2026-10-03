# Deployment checklist

- [ ] Push complete project to GitHub
- [ ] Deploy `backend/` to Render
- [ ] Confirm `GET /api/health` returns `{ "status": "ok" }`
- [ ] Set backend `FRONTEND_URL` to the Vercel URL
- [ ] Deploy `frontend/` to Vercel
- [ ] Set Vercel `VITE_API_URL` to the Render backend URL
- [ ] Redeploy Vercel
- [ ] Upload a real Netflix CSV
- [ ] Verify all 9 Wrapped screens
