# IdentiX – Decentralized Identity & Verifiable Credentials Platform

IdentiX is a blockchain-backed decentralized identity (DID) and verifiable credentials (VC) platform built as part of the IITGN Codeversity Hackathon. The system enables secure, privacy-preserving credential issuance, ownership, and verification for education and workforce use cases.

IdentiX allows trusted institutions to issue cryptographically verifiable credentials to individuals, who fully own and control them through a digital wallet. Verifiers can instantly validate credentials without contacting the issuing authority, eliminating fraud and manual verification delays.

---

## 🌟 Core Features (Hackathon MVP)

- Decentralized Identifiers (DIDs) aligned with W3C standards
- Verifiable Credential issuance and verification
- Off-chain credential storage with on-chain hash anchoring
- Blockchain-based credential revocation registry
- Trusted issuer registry
- Privacy-first design (no personal data stored on blockchain)

---

## 🧠 System Philosophy

- Blockchain is used strictly as a **trust anchor**
- Credentials are created and stored **off-chain**
- Verification is **cryptographic and trustless**
- Users **own and control** their credentials
- No centralized identity database

---

## 📁 Project Structure

identix-did-vc/
├── backend/ # Express.js backend API
│ ├── src/
│ │ ├── config/
│ │ ├── routes/
│ │ ├── controllers/
│ │ ├── services/
│ │ ├── crypto/
│ │ ├── middleware/
│ │ ├── models/
│ │ └── tests/
│ └── package.json
│
├── blockchain/ # Solidity smart contracts
│ ├── contracts/
│ ├── scripts/
│ └── hardhat.config.js
│
├── frontend/ # Frontend applications
│ ├── app/ # Unified app (Wallet + Issuer + Verifier)
│ ├── issuer/
│ ├── verifier/
│ └── wallet/
│
└── docs/ # Architecture & demo documentation
├── architecture.md
├── api-spec.md
└── demo-flow.md


---

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- Veramo (DID & Verifiable Credentials)
- MongoDB
- ethers.js

### Blockchain
- Ethereum-compatible testnet (Polygon Amoy / Sepolia)
- Solidity
- Hardhat

### Frontend
- React
- TailwindCSS
- QR-based credential sharing

---

## 🔐 Security Model (Implemented)

- Cryptographic signature verification
- Trusted issuer registry
- Blockchain-backed credential revocation
- Rate limiting and input validation
- No Aadhaar, phone numbers, emails, or personal identifiers stored

---

## 📖 API Overview (Implemented)

### DID Management
- `POST /api/did/create` – Create a decentralized identifier
- `POST /api/did/recover` – Recover DID using seed phrase
- `GET /api/did/:did` – Resolve DID document

### Credential Management
- `POST /api/credentials/issue` – Issue a verifiable credential
- `GET /api/credentials/:id` – Retrieve credential
- `GET /api/credentials/verify` – Verify credential authenticity
- `POST /api/credentials/revoke` – Revoke a credential

### Blockchain Utilities
- `GET /api/blockchain/check/:hash` – Check credential hash status
- `GET /api/blockchain/tx/:txHash` – Get blockchain transaction details

---

## 🔁 End-to-End Demo Flow

1. Issuer issues a verifiable credential
2. Holder receives credential in wallet
3. Holder shares credential via QR code
4. Verifier scans QR code
5. Backend verifies signature and revocation status
6. Blockchain confirms issuer trust
7. Result displayed as **VERIFIED** or **REVOKED**

---

## 📜 Standards Alignment

- W3C Decentralized Identifiers (DID) v1.0
- W3C Verifiable Credentials Data Model v1.1

---

## 🚀 Future Scope

- Selective disclosure of credential attributes
- Social recovery for decentralized identities
- Batch credential verification
- Enterprise-grade access controls

---

## 👥 Team

IdentiX is developed by a team of five members as part of the IITGN Codeversity Hackathon.

---

## 📄 License

This project is released under the MIT License.
