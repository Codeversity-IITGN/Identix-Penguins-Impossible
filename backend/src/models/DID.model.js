const mongoose = require('mongoose');

const didSchema = new mongoose.Schema({
  did: { type: String, required: true, unique: true },
  method: { type: String, default: 'ethr' },
  controllerKeyId: String,
  document: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.DID || mongoose.model('DID', didSchema);
