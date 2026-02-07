/**
 * Encryption/decryption for claim keys using military time digit sum.
 * Encryption: Sum digits of current time (HHMMSS), add that value to each ASCII char, append 2-digit sum suffix (padded with 0 if single digit/zero).
 * Decryption: Last two chars = shift; subtract that from each character's ASCII (excluding suffix).
 */

function getTimeShift() {
    const now = new Date();
    const h = now.getHours();   // 0-23
    const m = now.getMinutes(); // 0-59
    const s = now.getSeconds(); // 0-59
    const digits = [
        Math.floor(h / 10), h % 10,
        Math.floor(m / 10), m % 10,
        Math.floor(s / 10), s % 10
    ];
    return digits.reduce((sum, d) => sum + d, 0);
}

/** Pad shift to 2 digits: 0 -> "00", 7 -> "07", 17 -> "17" */
function shiftToSuffix(shift) {
    return shift < 10 ? '0' + shift : String(shift);
}

function encrypt(text) {
    if (!text || typeof text !== 'string') return '';
    const shift = getTimeShift();
    const encoded = text.split('').map(char => {
        const code = char.charCodeAt(0);
        return String.fromCharCode((code + shift) % 256);
    }).join('');
    return encoded + shiftToSuffix(shift);
}

function decrypt(text) {
    if (!text || typeof text !== 'string') return '';
    if (text.length < 2) return '';
    const suffix = text.slice(-2);
    const shift = parseInt(suffix, 10);
    if (Number.isNaN(shift) || shift < 0 || shift > 99) return '';
    const encryptedPart = text.slice(0, -2);
    return encryptedPart.split('').map(char => {
        const code = char.charCodeAt(0);
        return String.fromCharCode((code - shift + 256) % 256);
    }).join('');
}

module.exports = { encrypt, decrypt };
