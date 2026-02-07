// DID routes
const express = require('express');
const router = express.Router();
const didController = require('../controllers/did.controller');

router.post('/create', didController.createDID);
router.post('/recover', didController.recoverDID);
router.get('/:did', didController.resolveDID);
router.put('/:did', didController.updateDID);
router.delete('/:did', didController.deleteDID);

module.exports = router;
