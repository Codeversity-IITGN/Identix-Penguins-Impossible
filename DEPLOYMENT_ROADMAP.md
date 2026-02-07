# Deployment roadmap – IdentiX (all changes)

Use this as the single checklist for deploying the app with every change included. Order matters: do **Pre-deploy** → **Backend** → **Frontend** → **Wire together** → **Verify**.

---

## What’s included in this deploy

- **Claim key (OTP):** Without SMTP, OTP is returned in the API response and the app pre-fills it. With SMTP env vars, OTP is sent by email.
- **Claim key encryption:** Time-based encryption; invalid keys show “Invalid encryption key” and do not issue credentials.
- **Invalid claim key:** Issuer sees “Invalid encryption key” when the key is wrong; credential is not issued.
- **Backend:** `nodemailer` in `package.json` for optional email; no code change needed for “no SMTP” mode.

---

## Pre-deploy (local, before pushing)

| Step | Action |
|------|--------|
| 1 | Ensure all changes are committed (claim key, encryption, email util, IssuerContext/IssueCredential error handling, frontend OTP pre-fill). |
| 2 | From repo root: `cd backend` then `npm install` (so `nodemailer` is installed and lockfile is correct for Render). |
| 3 | Optional: `node scripts/test-email-otp.js` – should say “SMTP not configured” and “OTP would be returned in API response”. |
| 4 | Push to GitHub (e.g. `main`). |

---

## Part 1: MongoDB Atlas (if not already done)

| Step | Action |
|------|--------|
| 1 | Go to [cloud.mongodb.com](https://cloud.mongodb.com) → sign in. |
| 2 | Create a cluster (**M0 Free**). |
| 3 | **Database Access** → Add user (username + password; role: Read and write to any database). |
| 4 | **Network Access** → Add IP **0.0.0.0/0**. |
| 5 | **Database** → Connect → **Connect your application** → copy connection string. |
| 6 | Replace `<password>` in the string with your DB user password. Save the full URI (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/identix`). |

---

## Part 2: Backend on Render

### New backend service

| Step | Action |
|------|--------|
| 1 | [dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service**. |
| 2 | Connect GitHub repo; select branch (e.g. `main`). |
| 3 | **Settings:** |
| | **Name:** `identix-backend` (or your choice) |
| | **Region:** Pick one |
| | **Root Directory:** `backend` |
| | **Runtime:** Node |
| | **Build Command:** `npm install` |
| | **Start Command:** `npm start` |
| 4 | **Environment** – add these (replace placeholders): |

| Key | Value |
|-----|--------|
| `PORT` | `3000` |
| `NODE_ENV` | `production` |
| `DB_URI` | `mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/identix` (your Atlas URI) |

**Optional – send OTP by email (if you skip these, OTP is still returned in API and the app works):**

| Key | Value |
|-----|--------|
| `SMTP_HOST` | e.g. `smtp.gmail.com` |
| `SMTP_PORT` | `587` (or `465` for TLS) |
| `SMTP_USER` | your SMTP email |
| `SMTP_PASS` | your SMTP password or app password |
| `SMTP_FROM` | (optional) sender address |

| 5 | Create Web Service; wait for deploy. |
| 6 | Copy the backend URL (e.g. `https://identix-backend.onrender.com`). **Do not add `/api`** – the app expects the base URL. |

### If the backend already exists on Render

| Step | Action |
|------|--------|
| 1 | Backend service → **Environment**. |
| 2 | Ensure `PORT`, `NODE_ENV`, and `DB_URI` (or `MONGODB_URI`) are set as above. |
| 3 | Add optional SMTP vars if you want OTP by email. |
| 4 | **Save Changes** (triggers redeploy). |
| 5 | Confirm backend URL (e.g. `https://identix-backend.onrender.com`). |

---

## Part 3: Frontend on Render

### New frontend static site

| Step | Action |
|------|--------|
| 1 | Render dashboard → **New +** → **Static Site**. |
| 2 | Connect same GitHub repo; same branch. |
| 3 | **Settings:** |
| | **Name:** `identix-frontend` (or your choice) |
| | **Root Directory:** `frontend/app` |
| | **Build Command:** `npm install && npm run build` |
| | **Publish Directory:** `dist` |
| 4 | **Environment** – add (use your real backend URL): |

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://identix-backend.onrender.com/api` |

- Use the **exact** backend URL from Part 2.
- **Must end with `/api`.**

| 5 | Create Static Site; wait for deploy. |
| 6 | Copy the frontend URL (e.g. `https://identix-frontend.onrender.com`). |

### If the frontend already exists

| Step | Action |
|------|--------|
| 1 | Frontend service → **Environment**. |
| 2 | Set `VITE_API_URL` to `https://YOUR-BACKEND-URL/api` (with `/api`). |
| 3 | **Save Changes** (triggers rebuild). |
| 4 | Copy the frontend URL. |

---

## Part 4: Wire backend to frontend (CORS)

| Step | Action |
|------|--------|
| 1 | Open the **backend** service on Render. |
| 2 | **Environment** → Add (use your real frontend URL): |

| Key | Value |
|-----|--------|
| `FRONTEND_URL` | `https://identix-frontend.onrender.com` |

- No trailing slash. Must match the frontend URL exactly.

| 3 | **Save Changes** (triggers backend redeploy). |

---

## Part 5: Deployment checklist summary

Before you consider the deploy “done”, confirm:

| Check | Where |
|-------|--------|
| Backend env: `PORT`, `NODE_ENV`, `DB_URI` (or `MONGODB_URI`) | Render → Backend → Environment |
| Backend env: `FRONTEND_URL` = frontend URL (no trailing slash) | Render → Backend → Environment |
| Frontend env: `VITE_API_URL` = backend URL + `/api` | Render → Frontend → Environment |
| MongoDB Atlas: Network Access 0.0.0.0/0 | Atlas → Network Access |
| Optional: SMTP vars only if you want OTP by email | Render → Backend → Environment |

---

## Part 6: Verify after deploy

| Step | Action |
|------|--------|
| 1 | Open frontend URL in browser. |
| 2 | Create/open wallet. |
| 3 | **Generate claim key:** Wallet → Generate claim key → enter email → Send OTP. Without SMTP, OTP should **pre-fill**; with SMTP, check email. Enter OTP → Generate claim key → copy key. |
| 4 | **Issue credential:** Issuer → Issue credential → paste claim key + holder name + subject → Issue. Should succeed. |
| 5 | **Invalid key:** Issue credential with a wrong/fake claim key. Should see **“Invalid encryption key”** and no credential issued. |
| 6 | Backend health: open `https://YOUR-BACKEND-URL/health` → should return `{"status":"OK",...}`. |

---

## Changes summary (for your reference)

| Area | Change |
|------|--------|
| Backend | Claim key encryption (time-based); invalid key returns “Invalid encryption key”; OTP in response when SMTP not set; optional email via `utils/email.js` + nodemailer. |
| Frontend | Issuer: show API errors (e.g. “Invalid encryption key”); Wallet: pre-fill OTP when API returns `otp`. |
| Env | Backend: `PORT`, `NODE_ENV`, `DB_URI`, `FRONTEND_URL`; optional `SMTP_*`. Frontend: `VITE_API_URL` (must end with `/api`). |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| “Failed to send OTP” / no OTP pre-fill | Ensure backend deployed and `VITE_API_URL` is correct (ends with `/api`). Without SMTP, backend still returns OTP in response. |
| CORS errors in browser | Set `FRONTEND_URL` on backend to exact frontend URL (no trailing slash); redeploy backend. |
| Credential issued for wrong key | Should not happen; if it does, check backend logs and that the latest backend (with “Invalid encryption key” and claim key validation) is deployed. |
| Backend sleep (free tier) | First request after ~15 min idle can take 30–60 s; retry once. |
| DB connection errors | Check `DB_URI` and Atlas Network Access (0.0.0.0/0). |

---

## URLs (replace with yours)

| Service | URL |
|---------|-----|
| Backend API | `https://identix-backend.onrender.com` |
| Backend health | `https://identix-backend.onrender.com/health` |
| Frontend | `https://identix-frontend.onrender.com` |

After deployment, you can replace the table above with your real URLs for quick reference.
