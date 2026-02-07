
// Simulation of Issuer logic
const getWalletUrl = () => 'http://localhost:3001';

const getWalletClaimUrl = (credential) => {
    try {
        const json = JSON.stringify(credential);
        // Logic from Issuer/src/utils/config.js
        // We removed the outer encodeURIComponent
        const encoded = btoa(unescape(encodeURIComponent(json)));
        return `${getWalletUrl()}/claim#${encoded}`;
    } catch (e) {
        console.error('Issuer Encoding Error:', e.message);
        return `${getWalletUrl()}/claim`;
    }
};

// Simulation of Wallet logic
const processUrl = (url) => {
    try {
        const hashPart = url.split('#')[1];
        if (!hashPart) throw new Error('No hash found');

        const encoded = hashPart; // No decodeURIComponent on the full string in new logic

        // Logic from Wallet/src/pages/ClaimCredential.jsx
        let jsonStr;
        const cleanEncoded = encoded.replace(/^#/, '');

        try {
            // Option 1: Double encoded
            const step1 = cleanEncoded.includes('%') ? decodeURIComponent(cleanEncoded) : cleanEncoded;
            jsonStr = decodeURIComponent(escape(atob(step1)));
        } catch (e) {
            console.log('Primary decode failed, trying fallback');
            jsonStr = atob(cleanEncoded);
        }

        const credential = JSON.parse(jsonStr);
        return credential;
    } catch (e) {
        console.error('Wallet Decoding Error:', e.message);
        return null;
    }
};

// Test Case
const testCredential = {
    id: 'cred-123',
    name: 'José María', // Special chars
    details: {
        institution: 'University of Testing & Engineering',
        year: 2024
    }
};

console.log('Original:', JSON.stringify(testCredential, null, 2));

const url = getWalletClaimUrl(testCredential);
console.log('Generated URL:', url);

const decoded = processUrl(url);
console.log('Decoded:', JSON.stringify(decoded, null, 2));

const match = JSON.stringify(testCredential) === JSON.stringify(decoded);
console.log('Match:', match ? 'PASS' : 'FAIL');

if (!match) process.exit(1);
