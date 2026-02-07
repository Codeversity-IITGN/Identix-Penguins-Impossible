// Credential service
const { getAgent } = require('../config/veramo');
const CredentialModel = require('../models/Credential.model');
const { isDbConnected } = require('../config/db');
const { credentialStore } = require('../store/memoryStore');

const credentialTypeFrom = (type) => Array.isArray(type) ? (type[1] || type[0]) : (type || 'CustomCredential');

const issueCredential = async ({ issuerDID, holderDID, credentialSubject, type }) => {
    try {
        const credentialType = credentialTypeFrom(type);
        const baseCredential = {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            type: ['VerifiableCredential', credentialType],
            issuer: typeof issuerDID === 'string' ? { id: issuerDID } : issuerDID,
            credentialSubject: { id: holderDID, ...credentialSubject },
            issuanceDate: new Date().toISOString(),
        };

        let verifiableCredential;
        const agent = getAgent();
        if (agent) {
            try {
                verifiableCredential = await agent.createVerifiableCredential({
                    credential: baseCredential,
                    proofFormat: 'jwt',
                });
            } catch (e) {
                verifiableCredential = { ...baseCredential };
            }
        } else {
            verifiableCredential = { ...baseCredential };
        }

        const credentialId = verifiableCredential.proof?.jwt ||
            verifiableCredential.id ||
            `cred:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;

        const record = {
            credentialId,
            issuer: issuerDID,
            holder: holderDID,
            type: credentialType,
            credentialSubject,
            credential: { ...verifiableCredential, id: credentialId },
            status: 'active',
            issuanceDate: new Date(verifiableCredential.issuanceDate || Date.now()),
        };

        if (isDbConnected()) {
            const credentialRecord = new CredentialModel(record);
            await credentialRecord.save();
        } else {
            await credentialStore.save(record);
        }

        return { ...record.credential, id: credentialId };
    } catch (error) {
        throw new Error(`Failed to issue credential: ${error.message}`);
    }
};

const getCredential = async (credentialId) => {
    try {
        if (isDbConnected()) {
            const credential = await CredentialModel.findOne({ credentialId });
            if (!credential) throw new Error('Credential not found');
            return { ...credential.credential, id: credential.credentialId, status: credential.status };
        }
        const cred = await credentialStore.findOne({ credentialId });
        if (!cred) throw new Error('Credential not found');
        return { ...cred.credential, id: cred.credentialId, status: cred.status };
    } catch (error) {
        throw new Error(`Failed to get credential: ${error.message}`);
    }
};

const mapCred = (cred) => ({
    ...cred.credential,
    id: cred.credentialId,
    status: cred.status,
    type: cred.type,
});

const getCredentialsByHolder = async (holderDID) => {
    try {
        if (isDbConnected()) {
            const list = await CredentialModel.find({ holder: holderDID });
            return list.map(mapCred);
        }
        const list = await credentialStore.find({ holder: holderDID });
        return list.map(mapCred);
    } catch (error) {
        throw new Error(`Failed to get credentials: ${error.message}`);
    }
};

const getCredentialsByIssuer = async (issuerDID) => {
    try {
        if (isDbConnected()) {
            const list = await CredentialModel.find({ issuer: issuerDID });
            return list.map((cred) => ({
                ...cred.credential,
                id: cred.credentialId,
                status: cred.status,
                type: cred.type,
                holder: cred.holder,
                credentialSubject: cred.credentialSubject,
                issuanceDate: cred.issuanceDate,
            }));
        }
        const list = await credentialStore.find({ issuer: issuerDID });
        return list.map((cred) => ({
            ...cred.credential,
            id: cred.credentialId,
            status: cred.status,
            type: cred.type,
            holder: cred.holder,
            credentialSubject: cred.credentialSubject,
            issuanceDate: cred.issuanceDate,
        }));
    } catch (error) {
        throw new Error(`Failed to get credentials: ${error.message}`);
    }
};

module.exports = {
    issueCredential,
    getCredential,
    getCredentialsByHolder,
    getCredentialsByIssuer,
};
