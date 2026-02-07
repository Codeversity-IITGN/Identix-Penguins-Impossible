# Test OTP email locally (before pushing)

Run these from the **backend** folder.

## 1. Without SMTP (OTP in API response)

```bash
cd backend
npm run test:email
```

- If you have **no** `SMTP_*` in `.env`: script reports that SMTP is not configured and the OTP would be returned in the API response (this is what happens after deploy without SMTP).
- If you **have** `SMTP_*` in `.env`: script tries to send one test email to `TEST_EMAIL` (default `test@example.com`; set `TEST_EMAIL=you@example.com` in `.env` to use your address).

## 2. With fake inbox (Ethereal) – see the email in the browser

```bash
cd backend
npm run test:email:ethereal
```

- Creates a temporary Ethereal test account, sends one OTP email, and prints a **preview URL**.
- Open that URL in your browser to see the exact email (subject, body, OTP). No real SMTP or `.env` needed.
- Use this to confirm the email content and that sending works before pushing.

## 3. Full flow in the app

1. Start backend: `npm run dev` (from `backend`).
2. Start frontend: from `frontend/app`, `npm run dev`.
3. In the app: Wallet → Generate claim key → enter your email → **Send OTP**.
   - **Without SMTP:** The OTP should appear pre-filled (API returns it).
   - **With SMTP:** Check your inbox (or use Ethereal with real SMTP disabled and `--ethereal` only for the script; for app flow with Ethereal you’d need to set Ethereal credentials in `.env`).

To test **real** SMTP in the app, set in `backend/.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
```

Then run `npm run test:email` to verify send, and use the app to request an OTP to your email.
