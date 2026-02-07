// DID service – unique BIP39 seed per wallet; recover validates and derives DID
const { ethers } = require('ethers');
const { getAgent } = require('../config/veramo');
const DIDModel = require('../models/DID.model');
const { isDbConnected } = require('../config/db');
const { didStore } = require('../store/memoryStore');

/** Create a new DID with a unique 12-word BIP39 seed phrase. Returns did + seedPhrase. */
const createDID = async (method = 'ethr', options = {}) => {
    try {
        const wallet = ethers.Wallet.createRandom();
        const seedPhrase = wallet.mnemonic.phrase;
        const did = `did:ethr:${wallet.address}`;

        if (isDbConnected()) {
            const didRecord = new DIDModel({
                did,
                method,
                controllerKeyId: null,
                document: { did, keys: [], services: [] },
            });
            await didRecord.save();
        } else {
            await didStore.save({ did, method });
        }

        return { did, seedPhrase, keys: [], services: [] };
    } catch (error) {
        throw new Error(`Failed to create DID: ${error.message}`);
    }
};

/**
 * Recover DID from seed phrase. Validates BIP39 (word list + checksum) before deriving.
 * @throws Error if phrase is missing, invalid, or fails checksum
 */
const recoverDID = (seedPhrase) => {
    const normalized = (seedPhrase || '').trim();
    if (!normalized) throw new Error('Seed phrase is required');

    try {
        const wallet = ethers.Wallet.fromPhrase(normalized);
        const did = `did:ethr:${wallet.address}`;
        return { did, keys: [], services: [] };
    } catch (e) {
        if (e.code === 'INVALID_ARGUMENT' || e.message?.includes('mnemonic') || e.message?.includes('checksum')) {
            throw new Error('Invalid seed phrase. Please check that all 12 words are correct and try again.');
        }
        throw new Error('Invalid seed phrase. Please check the words and try again.');
    }
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
