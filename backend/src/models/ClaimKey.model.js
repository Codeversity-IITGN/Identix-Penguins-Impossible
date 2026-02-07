const mongoose = require('mongoose');

const claimKeySchema = new mongoose.Schema({
    claimKey: { type: String, required: true, unique: true },
    holderDID: { type: String, required: true },
    used: { type: Boolean, default: false },
    usedAt: Date,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.ClaimKey || mongoose.model('ClaimKey', claimKeySchema);
