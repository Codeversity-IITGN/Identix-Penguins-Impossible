# IdentiX - Coordinated Flow Guide

This guide explains how the three apps (Issuer, Wallet, Verifier) work together for both **Demo Mode** and **Real Mode**.

## Quick Start (Demo Mode - No Backend Required)

1. **Start all three apps** (in separate terminals):
   ```bash
   # Terminal 1 - Wallet (port 3001)
   cd frontend/wallet && npm run dev

   # Terminal 2 - Issuer (port 3002)
   cd frontend/issuer && npm run dev

   # Terminal 3 - Verifier (port 3003)
   cd frontend/verifier && npm run dev
   ```

2. **Wallet**: Open http://localhost:3001 → Click "Try Demo Mode" → See 2 demo credentials
3. **Issuer**: Open http://localhost:3002 → Click "Try Demo Mode" → Issue a credential
4. **Verifier**: Open http://localhost:3003 → Scan QR from Wallet or paste credential JSON

## End-to-End Flow (Demo Mode)

### Step 1: Holder Gets Their DID (Wallet)
- Open Wallet → Try Demo Mode
- Your DID: `did:ethr:0x1234567890123456789012345678901234567890`
- Click "Copy DID" to copy it

### Step 2: Issuer Issues Credential
- Open Issuer → Try Demo Mode
- Paste the holder's DID in "Holder DID" field
- Fill in credential details (name, degree, institution, etc.)
- Click "Issue Credential"
- **Click "Add to Wallet (Open in New Tab)"** - this opens the Wallet with the credential
- The credential is automatically added to the holder's wallet

### Step 3: Holder Shares Credential (Wallet)
- In Wallet, click on a credential to view details
- Click "Share via QR Code"
- The QR code contains the full credential JSON

### Step 4: Verifier Verifies (Verifier)
- Open Verifier → Click "Verify Credential"
- **Option A**: Scan the QR code from the Wallet (use camera)
- **Option B**: Paste the credential JSON (copy from Wallet's credential detail)
- Result: **VERIFIED** ✅ (for valid demo credentials)

## Real Mode (With Backend)

When the backend is running (with MongoDB):

1. **Wallet**: Create wallet or recover → Get real DID from backend
2. **Issuer**: Connect MetaMask → Issue credential → Backend stores it
3. **Holder**: Credentials appear in Wallet (fetched from backend by DID)
4. **Verifier**: Scan QR → Backend verifies signature and revocation status

## Shared Demo Data

All three apps use **identical demo data** from `frontend/shared/demoData.js`:
- Demo Holder DID: `did:ethr:0x1234...7890`
- Demo Issuer DID: `did:ethr:0x9876...3210`
- Demo credentials have consistent IDs and structure

This ensures:
- QR codes from Wallet work in Verifier
- Credentials issued by Issuer can be verified
- Demo mode coordinates across all apps

## Credential Claim Flow

When Issuer issues a credential (demo or real), the "Add to Wallet" button generates a URL:
```
http://localhost:3001/claim#<base64-encoded-credential>
```

Opening this URL in the Wallet app automatically adds the credential to the holder's wallet.

## Troubleshooting

- **Wallet demo not opening**: Ensure you clicked "Try Demo Mode" on the Welcome page first
- **QR not verifying**: Ensure you're scanning the credential from Wallet (not a random QR)
- **Credentials not syncing**: In demo mode, use "Add to Wallet" link from Issuer after issuing
