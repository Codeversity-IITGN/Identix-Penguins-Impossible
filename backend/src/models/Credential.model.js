const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
  credentialId: { type: String, required: true, unique: true },
  issuer: { type: String, required: true },
  holder: { type: String, required: true },
  type: { type: String, default: 'CustomCredential' },
  credentialSubject: { type: mongoose.Schema.Types.Mixed },
  credential: { type: mongoose.Schema.Types.Mixed, required: true },
  status: { type: String, default: 'active' },
  issuanceDate: { type: Date, default: Date.now },
  revocationReason: String,
  revokedAt: Date,
});

module.exports = mongoose.models.Credential || mongoose.model('Credential', credentialSchema);
