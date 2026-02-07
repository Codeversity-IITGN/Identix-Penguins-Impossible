/**
 * In-memory store for when MongoDB is not available.
 * Enables backend to run and coordinate all three frontends without a database.
 */
const credentials = new Map(); // credentialId -> { credentialId, issuer, holder, type, credentialSubject, credential, status, issuanceDate }
const dids = new Map();       // did -> { did, method, createdAt }

const isConnected = () => false; // Used by services to check if we're using memory

const credentialStore = {
  async save(doc) {
    const id = doc.credentialId;
    credentials.set(id, {
      credentialId: id,
      issuer: doc.issuer,
      holder: doc.holder,
      type: doc.type,
      credentialSubject: doc.credentialSubject,
      credential: doc.credential,
      status: doc.status || 'active',
      issuanceDate: doc.issuanceDate || new Date(),
      revocationReason: doc.revocationReason,
      revokedAt: doc.revokedAt,
    });
    return doc;
  },
  async findOne(query) {
    const id = query.credentialId;
    return credentials.get(id) || null;
  },
  async find(query) {
    const holder = query.holder;
    const issuer = query.issuer;
    const list = [];
    for (const cred of credentials.values()) {
      if (holder && cred.holder === holder) list.push(cred);
      else if (issuer && cred.issuer === issuer) list.push(cred);
    }
    return list;
  },
};

const didStore = {
  async save(doc) {
    dids.set(doc.did, { did: doc.did, method: doc.method || 'ethr', createdAt: new Date() });
    return doc;
  },
  async findOne(query) {
    return dids.get(query.did) ? { did: query.did } : null;
  },
};

module.exports = {
  credentials,
  dids,
  credentialStore,
  didStore,
  isConnected,
};
