// Credential routes
const express = require('express');
const router = express.Router();
const credentialController = require('../controllers/credential.controller');

router.post('/issue', credentialController.issueCredential);
router.post('/verify', credentialController.verifyCredential);
router.post('/revoke', credentialController.revokeCredential);
router.get('/holder/:did', credentialController.getCredentialsByHolder);
router.get('/issuer/:did', credentialController.getCredentialsByIssuer);
router.get('/:credentialId', credentialController.getCredential);

module.exports = router;
