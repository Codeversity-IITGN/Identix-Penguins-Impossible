// Verification service
const { getAgent } = require('../config/veramo');
const { isDbConnected } = require('../config/db');
const CredentialModel = require('../models/Credential.model');
const { credentialStore } = require('../store/memoryStore');

const verifyCredential = async (credential) => {
    const credentialId = credential.id || credential.credentialId;
    const issuer = credential.issuer?.id || credential.issuer;
    const holder = credential.credentialSubject?.id || credential.credentialSubject?.id;

    const formatResult = (verified, reason = null) => ({
        verified,
        credential,
        issuer,
        subject: credential.credentialSubject,
        issuanceDate: credential.issuanceDate,
        expirationDate: credential.expirationDate,
        reason,
        errors: reason ? [reason] : [],
    });

    const checkStored = async () => {
        if (isDbConnected()) {
            const stored = await CredentialModel.findOne({ credentialId });
            if (stored) return { verified: stored.status !== 'revoked', status: stored.status };
        } else {
            const stored = await credentialStore.findOne({ credentialId });
            if (stored) return { verified: stored.status !== 'revoked', status: stored.status };
        }
        return null;
    };

    try {
        const agent = getAgent();
        if (agent) {
            try {
                const result = await agent.verifyCredential({ credential });
                return formatResult(result.verified, result.verified ? null : (result.error?.message || 'Verification failed'));
            } catch (e) {
                const stored = await checkStored();
                if (stored) return formatResult(stored.verified, stored.verified ? null : 'Credential has been revoked');
                return formatResult(false, e.message || 'Verification failed');
            }
        }
        const stored = await checkStored();
        if (stored) return formatResult(stored.verified, stored.verified ? null : 'Credential has been revoked');
        return formatResult(false, 'Verification not available');
    } catch (error) {
        return formatResult(false, error.message);
    }
};

const verifyPresentation = async (presentation) => {
    try {
        const agent = getAgent();

        const result = await agent.verifyPresentation({
            presentation,
        });

        return {
            verified: result.verified,
            holder: presentation.holder,
            credentials: presentation.verifiableCredential,
            errors: result.error ? [result.error] : [],
        };
    } catch (error) {
        throw new Error(`Failed to verify presentation: ${error.message}`);
    }
};

module.exports = {
    verifyCredential,
    verifyPresentation,
};
