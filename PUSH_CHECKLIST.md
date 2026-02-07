# Pre-push checklist – email/OTP flow

This was verified so you can push to GitHub with confidence.

## What was checked

1. **Backend – OTP without SMTP**  
   When `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` are not set (e.g. on Render by default):
   - `requestOTP` does not send email and **includes `otp` in the API response**.
   - The frontend receives `data.otp` and pre-fills the OTP field, so the “Generate claim key” flow works after deployment without any email setup.

2. **Backend – OTP with SMTP**  
   When you set `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` in the backend env:
   - `sendOtpEmail()` sends the OTP to the user’s email.
   - The API response does **not** include `otp`; the user gets the code from their inbox.

3. **API shape**  
   - `POST /api/claim-key/request-otp` returns `{ success: true, data: { message, otp? } }`.
   - Frontend uses `out.data` and `if (res.otp) setOtp(res.otp)`, so the pre-fill works when `otp` is present.

4. **Test script**  
   - `backend/scripts/test-email-otp.js` runs without `--ethereal` and correctly reports “SMTP not configured” and “OTP would be returned in API response” when no SMTP env vars are set.
   - With `--ethereal`, it would send to a fake inbox (requires `npm install` in backend for nodemailer).

## Before you push

- Run **once** in the backend folder: `npm install`  
  (so `nodemailer` is in `node_modules` and Render will install it from `package.json` on deploy.)
- Optional: run `node scripts/test-email-otp.js` from the backend folder to see the “no SMTP” message again.

## After push / on Render

- **Without adding any env vars:** Generate claim key will work; the OTP will be in the API response and the app will pre-fill it.
- **To send OTP by real email:** Add `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` (and optionally `SMTP_PORT`, `SMTP_FROM`) in the Render backend environment.

You’re good to push.
