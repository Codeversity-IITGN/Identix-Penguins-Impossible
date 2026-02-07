/**
 * Optional email sending for OTP. Uses SMTP when env vars are set.
 * Env: SMTP_HOST, SMTP_PORT (optional, default 587), SMTP_SECURE (optional),
 *      SMTP_USER, SMTP_PASS, SMTP_FROM (optional, default SMTP_USER).
 * When not configured or send fails, returns false so caller can return OTP in API response.
 */

let transporter = null;

function isEmailConfigured() {
    return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter() {
    if (transporter) return transporter;
    if (!isEmailConfigured()) return null;
    try {
        const nodemailer = require('nodemailer');
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587', 10),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        return transporter;
    } catch (err) {
        console.warn('[Email] Nodemailer not available or SMTP config invalid:', err.message);
        return null;
    }
}

/**
 * Send OTP to email. Returns true if sent, false if not configured or failed.
 */
async function sendOtpEmail(to, otp) {
    const trans = getTransporter();
    if (!trans) return false;
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    try {
        await trans.sendMail({
            from: typeof from === 'string' && from.includes('@') ? `IdentiX <${from}>` : from,
            to,
            subject: 'Your IdentiX claim key OTP',
            text: `Your one-time password is: ${otp}\n\nIt is valid for 5 minutes. Do not share it.`,
            html: `<p>Your one-time password is: <strong>${otp}</strong></p><p>It is valid for 5 minutes. Do not share it.</p>`,
        });
        return true;
    } catch (err) {
        console.error('[Email] Failed to send OTP:', err.message);
        return false;
    }
}

module.exports = { isEmailConfigured, sendOtpEmail };
