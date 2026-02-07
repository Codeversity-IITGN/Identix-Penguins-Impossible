// Revocation service
const CredentialModel = require('../models/Credential.model');
const { getContract } = require('../config/blockchain');
const { isDbConnected } = require('../config/db');
const { credentialStore } = require('../store/memoryStore');

const revokeCredential = async (credentialId, reason = 'unspecified') => {
    try {
        if (isDbConnected()) {
            const credential = await CredentialModel.findOne({ credentialId });
            if (!credential) throw new Error('Credential not found');
            credential.status = 'revoked';
            credential.revocationReason = reason;
            credential.revokedAt = new Date();
            await credential.save();
            const contract = getContract();
            if (contract) {
                try {
                    const tx = await contract.revokeCredential(credentialId);
                    await tx.wait();
                } catch (e) {
                    console.warn('Blockchain revoke skipped:', e.message);
                }
            }
            return { credentialId, status: 'revoked', reason, revokedAt: credential.revokedAt };
        }
        const cred = await credentialStore.findOne({ credentialId });
        if (!cred) throw new Error('Credential not found');
        cred.status = 'revoked';
        cred.revocationReason = reason;
        cred.revokedAt = new Date();
        credentialStore.credentials.set(credentialId, cred);
        return { credentialId, status: 'revoked', reason, revokedAt: cred.revokedAt };
    } catch (error) {
        throw new Error(`Failed to revoke credential: ${error.message}`);
    }
};

const checkRevocationStatus = async (credentialId) => {
    try {
        if (isDbConnected()) {
            const credential = await CredentialModel.findOne({ credentialId });
            if (!credential) throw new Error('Credential not found');
            return {
                credentialId,
                status: credential.status,
                revoked: credential.status === 'revoked',
                revokedAt: credential.revokedAt,
                revocationReason: credential.revocationReason,
            };
        }
        const cred = await credentialStore.findOne({ credentialId });
        if (!cred) throw new Error('Credential not found');
        return {
            credentialId,
            status: cred.status,
            revoked: cred.status === 'revoked',
            revokedAt: cred.revokedAt,
            revocationReason: cred.revocationReason,
        };
    } catch (error) {
        throw new Error(`Failed to check revocation status: ${error.message}`);
    }
};

module.exports = {
    revokeCredential,
    checkRevocationStatus,
};
