# Deploy IdentiX to Render – Exact Steps

## Prerequisites

- [Render](https://render.com) account (free)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier)
- Code pushed to GitHub

---

## Part 1: MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and sign in.
2. Create a cluster (choose **M0 Free**).
3. Click **Database Access** → **Add New Database User**:
   - Create username and password (save them).
   - Role: **Read and write to any database**.
4. Click **Network Access** → **Add IP Address**:
   - Add **0.0.0.0/0** (allow all).
5. Click **Database** → **Connect** → **Connect your application**.
6. Copy the connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/identix`).
7. Replace `<password>` with your actual password.

---

## Part 2: Render – Backend Web Service

1. Go to [dashboard.render.com](https://dashboard.render.com) and sign in.
2. Click **New +** → **Web Service**.
3. Connect your GitHub repo (`identix-did-vc`).
4. Configure:
   - **Name:** `identix-backend`
   - **Region:** Choose closest to you.
   - **Branch:** `main` (or your default branch).
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. **Environment Variables** (Add Environment Variable):
   | Key | Value |
   |-----|-------|
   | `PORT` | `3000` |
   | `DB_URI` or `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/identix` |
   | `NODE_ENV` | `production` |
   **Optional – OTP by email:** To send claim-key OTPs by email, add SMTP variables so users receive the OTP in their inbox. If you do *not* set these, the API will return the OTP in the response so the flow still works (the app will show/pre-fill the code).
   | Key | Value |
   |-----|-------|
   | `SMTP_HOST` | e.g. `smtp.gmail.com` or your provider’s host |
   | `SMTP_PORT` | `587` (or `465` for TLS) |
   | `SMTP_USER` | your SMTP username / email |
   | `SMTP_PASS` | your SMTP password or app password |
   | `SMTP_FROM` | (optional) sender address, defaults to `SMTP_USER` |
6. Click **Create Web Service**.
7. Wait for first deploy. Copy the backend URL (e.g. `https://identix-backend.onrender.com`).

---

## Part 3: Render – Frontend Static Site

1. In Render dashboard, click **New +** → **Static Site**.
2. Connect the same GitHub repo.
3. Configure:
   - **Name:** `identix-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend/app`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://identix-backend.onrender.com/api` |
   
   Use your actual backend URL from Part 2.
5. Click **Create Static Site**.
6. Wait for first deploy. Copy the frontend URL (e.g. `https://identix-frontend.onrender.com`).

---

## Part 4: Allow Frontend in Backend CORS

1. Open the backend service in Render.
2. Go to **Environment**.
3. Add:
   | Key | Value |
   |-----|-------|
   | `FRONTEND_URL` | `https://identix-frontend.onrender.com` |
4. **Save Changes** (this triggers a redeploy).

---

## Part 5: Verify Deployment

1. Open the frontend URL in a browser.
2. Create a wallet, issue a credential, and verify it.
3. If errors appear, check:
   - **Frontend:** `VITE_API_URL` is correct and ends with `/api`.
   - **Backend:** `DB_URI` is correct and MongoDB Atlas network access allows `0.0.0.0/0`.
   - **Backend:** `FRONTEND_URL` matches the frontend URL exactly.

---

## OTP / Claim key

- **Without SMTP:** The backend does not send OTP by email. It returns the OTP in the API response so the “Generate claim key” flow works after deployment; the app will pre-fill the OTP when the API returns it.
- **With SMTP:** Set `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` (and optionally `SMTP_PORT`, `SMTP_FROM`) so OTPs are sent to the user’s email and are not included in the API response.

---

## Important Notes

- **Free tier sleep:** Render free web services sleep after ~15 minutes of inactivity. First request after sleep can take 30–60 seconds.
- **Build time:** Static site builds run in the cloud; `npm install` may take a few minutes.
- **Health check:** Backend `/health` is used by Render for health checks.
- **Custom domains:** You can add custom domains under each service’s **Settings**.

---

## URLs Summary

| Service | URL |
|---------|-----|
| Backend API | `https://identix-backend.onrender.com` |
| Frontend | `https://identix-frontend.onrender.com` |
| Health Check | `https://identix-backend.onrender.com/health` |
