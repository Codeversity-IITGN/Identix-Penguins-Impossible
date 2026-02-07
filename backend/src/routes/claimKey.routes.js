const express = require('express');
const router = express.Router();
const claimKeyController = require('../controllers/claimKey.controller');

router.post('/request-otp', claimKeyController.requestOTP);
router.post('/generate', claimKeyController.generateClaimKey);

module.exports = router;
