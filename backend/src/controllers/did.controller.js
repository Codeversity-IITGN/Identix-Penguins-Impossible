// DID controller
const didService = require('../services/did.service');

const createDID = async (req, res, next) => {
    try {
        const { method, options } = req.body;
        const did = await didService.createDID(method, options);
        res.status(201).json({ success: true, data: did });
    } catch (error) {
        next(error);
    }
};

const resolveDID = async (req, res, next) => {
    try {
        const { did } = req.params;
        const didDocument = await didService.resolveDID(did);
        res.status(200).json({ success: true, data: didDocument });
    } catch (error) {
        next(error);
    }
};

const updateDID = async (req, res, next) => {
    try {
        const { did } = req.params;
        const { updates } = req.body;
        const result = await didService.updateDID(did, updates);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const deleteDID = async (req, res, next) => {
    try {
        const { did } = req.params;
        await didService.deleteDID(did);
        res.status(200).json({ success: true, message: 'DID deleted successfully' });
    } catch (error) {
        next(error);
    }
};

const recoverDID = async (req, res, next) => {
    try {
        const { seedPhrase } = req.body || {};
        if (!seedPhrase) {
            return res.status(400).json({
                error: { message: 'seedPhrase is required', status: 400 },
            });
        }
        const data = didService.recoverDID(seedPhrase);
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createDID,
    recoverDID,
    resolveDID,
    updateDID,
    deleteDID,
};
