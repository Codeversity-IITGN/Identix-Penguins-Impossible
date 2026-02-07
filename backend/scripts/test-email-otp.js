/**
 * Local test for OTP email – run before pushing to verify email flow.
 *
 * Usage (from backend folder):
 *   node scripts/test-email-otp.js              # Test without SMTP (OTP in response)
 *   node scripts/test-email-otp.js --ethereal   # Send to fake inbox; opens preview URL
 *   node scripts/test-email-otp.js               # With .env SMTP_* set, tests real send
 *
 * For Ethereal: no .env needed; script creates a temporary test account and prints a URL
 * to open in the browser to see the sent email.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const TEST_OTP = '123456';
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';

async function runWithEthereal() {
    const nodemailer = require('nodemailer');
    console.log('Creating Ethereal test account...');
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: { user: testAccount.user, pass: testAccount.pass },
    });
    const info = await transporter.sendMail({
        from: `IdentiX <${testAccount.user}>`,
        to: TEST_EMAIL,
        subject: 'Your IdentiX claim key OTP',
        text: `Your one-time password is: ${TEST_OTP}\n\nIt is valid for 5 minutes. Do not share it.`,
        html: `<p>Your one-time password is: <strong>${TEST_OTP}</strong></p><p>It is valid for 5 minutes. Do not share it.</p>`,
    });
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('\n✅ Email sent (Ethereal test inbox).');
    console.log('   Open this URL in your browser to see the email:');
    console.log('   ' + (previewUrl || '(no preview URL)'));
    console.log('');
}

async function runWithRealSmtp() {
    const { sendOtpEmail, isEmailConfigured } = require('../src/utils/email');
    if (!isEmailConfigured()) {
        console.log('SMTP not configured (missing SMTP_HOST, SMTP_USER, or SMTP_PASS).');
        console.log('Sending would be skipped and OTP would be returned in API response.\n');
        return;
    }
    console.log('SMTP is configured. Sending test OTP email to:', TEST_EMAIL);
    const sent = await sendOtpEmail(TEST_EMAIL, TEST_OTP);
    if (sent) {
        console.log('✅ Email sent successfully. Check', TEST_EMAIL, '(or your SMTP logs).\n');
    } else {
        console.log('❌ Send failed. Check SMTP_* in .env and server logs above.\n');
    }
}

async function main() {
    const useEthereal = process.argv.includes('--ethereal');
    console.log('--- IdentiX OTP email test ---\n');

    if (useEthereal) {
        await runWithEthereal();
        return;
    }

    await runWithRealSmtp();

    console.log('To test with a fake inbox (Ethereal), run:');
    console.log('  node scripts/test-email-otp.js --ethereal\n');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
