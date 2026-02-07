// Blockchain routes - stub for demo mode
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Blockchain API (demo mode - no chain connected)' });
});

module.exports = router;
