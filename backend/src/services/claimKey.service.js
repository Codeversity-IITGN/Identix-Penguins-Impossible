const { encrypt, decrypt } = require('../utils/claimKeyEncryption');
const ClaimKeyModel = require('../models/ClaimKey.model');
const { isDbConnected } = require('../config/db');
const { claimKeyStore, otpStore } = require('../store/memoryStore');

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const OTP_LENGTH = 6;

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function getOtpKey(did, email) {
    return `${did}:${email}`.toLowerCase();
}

async function requestOTP(did, email) {
    if (!did || !email) {
        throw new Error('DID and email are required');
    }
    const key = getOtpKey(did, email);
    const otp = generateOTP();
    otpStore.set(key, { otp, expiresAt: Date.now() + OTP_EXPIRY_MS });
    // In production, send OTP via email. For demo without SMTP, log to console.
    console.log(`[Claim Key OTP] DID: ${did}, Email: ${email} -> OTP: ${otp} (valid 5 min)`);
    const result = { success: true, message: 'OTP sent to email' };
    if (process.env.NODE_ENV !== 'production') {
        result.otp = otp;
    }
    return result;
}

async function verifyOTP(did, email, otp) {
    const key = getOtpKey(did, email);
    const stored = otpStore.get(key);
    if (!stored) throw new Error('OTP expired or not found. Please request a new OTP.');
    if (Date.now() > stored.expiresAt) {
        otpStore.delete(key);
        throw new Error('OTP expired. Please request a new OTP.');
    }
    if (stored.otp !== String(otp).trim()) {
        throw new Error('Invalid OTP');
    }
    otpStore.delete(key);
    return true;
}

async function generateClaimKey(did, email, otp) {
    await verifyOTP(did, email, otp);
    const claimKey = encrypt(did);
    const record = {
        claimKey,
        holderDID: did,
        used: false,
        createdAt: new Date(),
    };
    if (isDbConnected()) {
        const model = new ClaimKeyModel(record);
        await model.save();
    } else {
        await claimKeyStore.save(record);
    }
    return { claimKey };
}

function safeDecrypt(claimKey) {
    try {
        const decrypted = decrypt(claimKey);
        if (!decrypted || !decrypted.startsWith('did:')) return null;
        return decrypted;
    } catch {
        return null;
    }
}

async function validateAndConsumeClaimKey(claimKey) {
    if (!claimKey || typeof claimKey !== 'string') {
        throw new Error('Invalid encryption key');
    }
    let record;
    if (isDbConnected()) {
        record = await ClaimKeyModel.findOne({ claimKey });
    } else {
        record = await claimKeyStore.findOne({ claimKey });
    }
    if (!record) {
        const decrypted = safeDecrypt(claimKey);
        if (!decrypted) {
            throw new Error('Invalid encryption key');
        }
        throw new Error('Invalid encryption key');
    }
    if (record.used) {
        throw new Error('This claim key has already been used and cannot be used again.');
    }
    const decrypted = safeDecrypt(claimKey);
    if (!decrypted || decrypted !== record.holderDID) {
        throw new Error('Invalid encryption key');
    }
    const usedAt = new Date();
    if (isDbConnected()) {
        await ClaimKeyModel.updateOne({ claimKey }, { used: true, usedAt });
    } else {
        await claimKeyStore.updateOne({ claimKey }, { used: true, usedAt });
    }
    return record.holderDID;
}

module.exports = {
    requestOTP,
    generateClaimKey,
    validateAndConsumeClaimKey,
};
