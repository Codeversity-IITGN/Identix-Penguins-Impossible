# Lovable AI – IdentiX Frontend Redesign Prompt

Copy everything below the line into Lovable AI to rebuild/redesign the frontend.

---

## Project overview

Build the frontend for **IdentiX**: a Decentralized Identity & Verifiable Credentials platform with **three separate web apps** that share one backend API. The apps are: **Wallet** (holders), **Issuer** (universities/employers), and **Verifier** (employers/institutions). All three must feel like one product: same design system, theme, and components.

---

## Repo structure (match this exactly)

```
frontend/
├── wallet/                    # App 1: Holder's credential wallet
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── context/
│       │   └── WalletContext.jsx
│       ├── components/
│       │   └── (shared UI components)
│       ├── pages/
│       │   ├── Welcome.jsx
│       │   ├── CreateWallet.jsx
│       │   ├── RecoverWallet.jsx
│       │   ├── CredentialsList.jsx
│       │   ├── CredentialDetail.jsx
│       │   └── ClaimCredential.jsx
│       └── utils/
│           ├── demoData.js
│           └── api.js
│
├── issuer/                    # App 2: Credential issuer (universities, employers)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── context/
│       │   └── WalletContext.jsx
│       ├── components/
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── IssueCredential.jsx
│       │   ├── IssuedCredentials.jsx
│       │   └── RevokeCredential.jsx
│       └── utils/
│           ├── demoData.js
│           └── config.js
│
└── verifier/                  # App 3: Credential verifier
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── components/
        ├── pages/
        │   ├── Landing.jsx
        │   ├── QRScan.jsx
        │   └── VerificationResult.jsx
        └── utils/
            └── demoData.js
```

- Each app is a **separate Vite + React** project (React Router, Tailwind CSS).
- API base: relative `/api` (proxied to backend in vite: `proxy: { '/api': { target: 'http://localhost:3000' } }`).
- Ports: Wallet **3001**, Issuer **3002**, Verifier **3003**.

---

## Design system (apply to all 3 apps)

- **Style:** Simplistic, sleek, futuristic. Plenty of whitespace, clear hierarchy, subtle motion.
- **Theme colors:**
  - **Primary:** Black (backgrounds, text in light mode).
  - **Accent:** Orange (CTAs, highlights, borders, icons). Use one main orange (e.g. `#F97316` or `#EA580C`) and a lighter/darker variant.
- **Light/Dark mode:** Implement a **global theme toggle** (e.g. in nav/sidebar or header). Persist choice (e.g. `localStorage`). In dark mode: dark backgrounds (e.g. `#0a0a0a`, `#171717`), light text; keep orange as accent in both themes.
- **Typography:** Clean sans-serif (e.g. Inter, DM Sans, or Space Grotesk). Clear heading scale and readable body.
- **Cards:** Use **interactive cards** for every credential/document:
  - Hover: slight lift, soft shadow, optional orange border or glow.
  - Click: navigate to detail or expand.
  - Show: type, issuer/holder, date, status (active/revoked) in a compact layout.
- **Icons:** Use a single set (e.g. Lucide React) across all three apps.
- **Motion:** Subtle transitions (e.g. 200–300ms) on hover, route change, and toggle.

---

## App 1 – Wallet (holder)

**Purpose:** Users create/recover a wallet (DID), view their credentials, share via QR, and claim credentials from issuers.

**Pages and sections:**

1. **Welcome** (`/`)  
   - Hero: “Your digital identity wallet.”  
   - Two main actions: “Create new wallet”, “Recover wallet”.  
   - Optional: “Try demo mode” (no backend).  
   - Theme toggle in corner.

2. **Create wallet** (`/create-wallet`)  
   - One-click “Create wallet” → call `POST /api/did/create`.  
   - Then: show **12-word seed phrase** in a clear, copyable block; warning to save it.  
   - Show **DID** (e.g. `did:ethr:0x...`) with copy button.  
   - Confirm checkbox “I have saved my seed phrase” → button “Continue to wallet”.

3. **Recover wallet** (`/recover-wallet`)  
   - Textarea for 12-word seed phrase.  
   - “Recover wallet” → `POST /api/did/recover` with `{ seedPhrase }`.  
   - On success → redirect to credentials list.

4. **Credentials list** (`/credentials`)  
   - **Interactive cards** for each credential: type, issuer, issue date, status.  
   - Click card → go to credential detail.  
   - Prominent display of **current DID** (with copy).  
   - If no credentials: empty state + copy DID for issuers.

5. **Credential detail** (`/credential/:credentialId`)  
   - One credential: type, issuer, subject fields, dates.  
   - “Share via QR” (encode credential JSON in QR).  
   - “Copy JSON” for manual share.  
   - Use cards/sections for readability.

6. **Claim credential** (`/claim`)  
   - Read credential from URL (hash or query).  
   - “Credential added” or error state.  
   - Button “View my credentials”.

**Context:** `WalletContext` holds: `did`, `credentials`, `loading`, `createDID`, `recoverDID`, `refreshCredentials`, `addCredential`, `getCredential`. Load credentials with `GET /api/credentials/holder/:did`.

---

## App 2 – Issuer

**Purpose:** Issuers (e.g. university) connect wallet, issue credentials to a holder DID, list issued credentials, and revoke.

**Pages and sections:**

1. **Login** (`/`)  
   - “Connect MetaMask” (or “Try demo mode”).  
   - On connect: derive issuer DID from wallet; redirect to Issue credential.

2. **Issue credential** (`/issue`)  
   - Form: Issuer DID (read-only), **Holder DID** (input), credential type (e.g. Educational / Professional / Identity), subject fields (name, degree, institution, date, etc.).  
   - Submit → `POST /api/credentials/issue`.  
   - Success: show “Credential issued” + **“Add to wallet”** link (opens Wallet app with credential in URL for claim).  
   - Theme toggle in nav.

3. **Issued credentials** (`/credentials`)  
   - **Interactive cards** for each issued credential: type, holder, date, status (active/revoked).  
   - Click card optional (e.g. detail or revoke).  
   - Actions: “Issue new”, “Revoke” (navigate to revoke page).  
   - Data: `GET /api/credentials/issuer/:issuerDID`.

4. **Revoke credential** (`/revoke`)  
   - Input: credential ID, optional reason.  
   - Submit → `POST /api/credentials/revoke`.  
   - Success: “Credential revoked” message.

**Context:** `WalletContext` for issuer: `account`, `connectWallet`, `isConnected` (MetaMask). Issuer DID = `did:ethr:${account}`.

---

## App 3 – Verifier

**Purpose:** Verifiers (e.g. employer) scan or paste a credential and see verified / revoked / invalid.

**Pages and sections:**

1. **Landing** (`/`)  
   - Hero: “Verify credentials instantly.”  
   - Short value props (cryptographic verification, revocation check).  
   - Primary CTA: “Verify credential” → `/verify`.  
   - Optional: “Try demo verification” (no backend).  
   - Theme toggle.

2. **Verify** (`/verify`)  
   - Tabs or buttons: **“Scan QR”** and **“Paste JSON”**.  
   - Scan: use camera to scan QR from Wallet’s credential detail.  
   - Paste: textarea for credential JSON + “Load sample credential” (from demo data).  
   - “Verify credential” → `POST /api/credentials/verify` with `{ credential }`.  
   - On response → save result and navigate to `/result`.

3. **Verification result** (`/result`)  
   - Read result from `sessionStorage` (set before navigate).  
   - **States:**  
     - **VERIFIED** (green): “This credential is authentic and valid.”  
     - **REVOKED** (yellow): “This credential has been revoked.”  
     - **INVALID** (red): show reason.  
   - Show credential type, issuer, subject, issue date in a clean card/section.  
   - Buttons: “Verify another”, “Back to home”.

---

## Shared requirements across all 3 UIs

- **Theme:** Black + orange; **light/dark toggle** in a consistent place (e.g. top-right or nav).
- **Interactive cards** for every credential/document list and, where relevant, on detail/result screens.
- **Responsive:** Usable on mobile and desktop (cards stack on small screens).
- **Loading states:** Spinner or skeleton when calling API.
- **Errors:** Inline or toast for API/local errors; do not leave user with a blank screen.
- **Tailwind:** Use a single Tailwind setup per app; define orange and black in `tailwind.config.js` and use CSS variables if you want to switch light/dark via class on `html` or a wrapper.

---

## Technical notes

- **React Router** for all routes above; keep existing route paths so backend and links still work.
- **Axios** (or fetch) for API; base URL `/api` (Vite proxy to backend).
- **QR:** Wallet “Share via QR” encodes credential JSON; Verifier “Scan QR” decodes and sends that object to `/api/credentials/verify`.
- **Demo mode:** When backend is unavailable, use local `demoData.js` in each app so flows still work for demo.

Deliver **all three apps** (Wallet, Issuer, Verifier) with the same design system, black + orange theme, interactive credential cards, and a working light/dark theme toggle.
