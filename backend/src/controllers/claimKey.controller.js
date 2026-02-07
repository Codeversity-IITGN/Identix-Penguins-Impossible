const claimKeyService = require('../services/claimKey.service');

const requestOTP = async (req, res, next) => {
    try {
        const { did, email } = req.body || {};
        const result = await claimKeyService.requestOTP(did, email);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const generateClaimKey = async (req, res, next) => {
    try {
        const { did, email, otp } = req.body || {};
        if (!did || !email || !otp) {
            return res.status(400).json({
                error: { message: 'did, email, and otp are required', status: 400 },
            });
        }
        const { claimKey } = await claimKeyService.generateClaimKey(did, email, otp);
        res.status(201).json({ success: true, data: { claimKey } });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    requestOTP,
    generateClaimKey,
};
