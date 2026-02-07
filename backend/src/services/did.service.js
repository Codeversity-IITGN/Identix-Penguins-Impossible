// DID service
const crypto = require('crypto');
const { getAgent } = require('../config/veramo');
const DIDModel = require('../models/DID.model');
const { isDbConnected } = require('../config/db');
const { didStore } = require('../store/memoryStore');

function generateEthAddress() {
    const hex = crypto.randomBytes(20).toString('hex');
    return `0x${hex}`;
}

const createDID = async (method = 'ethr', options = {}) => {
    try {
        const agent = getAgent();
        let did;
        let identifier;
        if (agent && typeof agent.didManagerCreate === 'function') {
            try {
                identifier = await agent.didManagerCreate({ provider: `did:${method}`, options });
                did = identifier.did;
            } catch (e) {
                did = `did:ethr:${generateEthAddress()}`;
            }
        } else {
            did = `did:ethr:${generateEthAddress()}`;
        }
        if (isDbConnected()) {
            const didRecord = new DIDModel({
                did,
                method,
                controllerKeyId: identifier?.keys?.[0]?.kid,
                document: identifier || { did },
            });
            await didRecord.save();
        } else {
            await didStore.save({ did, method });
        }
        return identifier && typeof identifier.toJSON === 'function'
            ? identifier.toJSON()
            : { did, keys: [], services: [] };
    } catch (error) {
        throw new Error(`Failed to create DID: ${error.message}`);
    }
};

const recoverDID = (seedPhrase) => {
    const normalized = (seedPhrase || '').trim().toLowerCase();
    if (!normalized) throw new Error('Seed phrase is required');
    const hash = crypto.createHash('sha256').update(normalized).digest('hex');
    const address = '0x' + hash.slice(0, 40);
    return { did: `did:ethr:${address}`, keys: [], services: [] };
};

const resolveDID = async (did) => {
    try {
        const agent = getAgent();
        if (agent && typeof agent.resolveDid === 'function') {
            return await agent.resolveDid({ didUrl: did });
        }
        return { id: did };
    } catch (error) {
        return { id: did };
    }
};

const updateDID = async (did, updates) => {
    if (!isDbConnected()) throw new Error('DID update requires database');
    const didRecord = await DIDModel.findOne({ did });
    if (!didRecord) throw new Error('DID not found');
    Object.assign(didRecord, updates);
    await didRecord.save();
    return didRecord;
};

const deleteDID = async (did) => {
    const agent = getAgent();
    if (agent && typeof agent.didManagerDelete === 'function') {
        try {
            await agent.didManagerDelete({ did });
        } catch (e) {
            // ignore
        }
    }
    if (isDbConnected()) await DIDModel.deleteOne({ did });
    return { success: true };
};

module.exports = {
    createDID,
    recoverDID,
    resolveDID,
    updateDID,
    deleteDID,
};
