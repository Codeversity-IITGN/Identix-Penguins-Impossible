# Quick Start Guide - IdentiX

## Single app (recommended)

The **unified frontend** at `frontend/app` provides Wallet, Issuer, and Verifier in one app. Start the backend, then the app:

```bash
# Terminal 1 - Backend (required for real DIDs and credentials)
cd backend
npm install
npm run dev

# Terminal 2 - Unified app (http://localhost:5173)
npm run dev:app
```

First time: install app dependencies with `cd frontend/app && npm install`.

From the app you can: create/recover wallet (DID), issue credentials, and verify credentials. The app proxies `/api` and `/health` to the backend (port 3000).

---

## Coordinated flow (legacy: three separate sites + backend)

For the **legacy** setup (separate Wallet, Issuer, Verifier apps), start the **backend first**, then the three frontends:

```bash
# Terminal 1 - Backend (required for coordination)
cd backend
npm install
npm run dev

# Terminal 2 - Wallet (http://localhost:3001)
cd frontend/wallet && npm run dev

# Terminal 3 - Issuer (http://localhost:3002)
cd frontend/issuer && npm run dev

# Terminal 4 - Verifier (http://localhost:3003)
cd frontend/verifier && npm run dev
```

- **Wallet**: Create or recover wallet → get DID from backend → credentials are stored on backend.
- **Issuer**: Issue credentials → stored on backend under holder DID.
- **Verifier**: Verify credential → backend checks signature and revocation.

The backend runs **without MongoDB** (uses in-memory store) if MongoDB is not available.

---

## Fix Missing Dependencies

The frontend apps need `lucide-react` installed. Run these commands:

```bash
# Wallet App
cd frontend/wallet
npm install

# Verifier App  
cd ../verifier
npm install

# Issuer App
cd ../issuer
npm install
```

## Run Frontend Apps

### Option 1: Run Each App Separately

```bash
# Terminal 1 - Wallet (http://localhost:3001)
cd frontend/wallet
npm run dev

# Terminal 2 - Verifier (http://localhost:3003)
cd frontend/verifier
npm run dev

# Terminal 3 - Issuer (http://localhost:3002)
cd frontend/issuer
npm run dev
```

### Option 2: Use Root Scripts

```bash
# From project root
npm run dev:wallet    # Terminal 1
npm run dev:verifier  # Terminal 2
npm run dev:issuer    # Terminal 3
```

## Verify Apps Are Running

1. **Wallet**: Open http://localhost:3001 - Should see Welcome page
2. **Verifier**: Open http://localhost:3003 - Should see Landing page  
3. **Issuer**: Open http://localhost:3002 - Should see Login page

## Troubleshooting

### Issue: Blank Page / White Screen

**Solution**: Check browser console for errors. Common issues:
- Missing dependencies → Run `npm install` in each frontend folder
- Port already in use → Change port in `vite.config.js`
- Import errors → Check all imports are correct

### Issue: "Cannot find module 'lucide-react'"

**Solution**: 
```bash
cd frontend/wallet && npm install lucide-react
cd ../verifier && npm install lucide-react
cd ../issuer && npm install lucide-react
```

### Issue: "Failed to resolve import"

**Solution**: Make sure all files exist:
- `frontend/wallet/src/pages/CreateWallet.jsx` ✅
- `frontend/wallet/src/pages/Welcome.jsx` ✅
- `frontend/verifier/src/pages/Landing.jsx` ✅
- `frontend/issuer/src/pages/Login.jsx` ✅

### Issue: TailwindCSS not working

**Solution**: Check these files exist:
- `tailwind.config.js` ✅
- `postcss.config.js` ✅
- `src/index.css` with `@tailwind` directives ✅

## Expected Behavior

### Without Backend:
- ✅ All pages load and display UI
- ✅ Navigation works
- ✅ Forms render correctly
- ❌ API calls fail (shows error messages)
- ❌ Actions don't complete

### With Backend:
- ✅ Everything works
- ✅ Can create wallets
- ✅ Can issue credentials
- ✅ Can verify credentials

## Quick Test

1. Open http://localhost:3001 (Wallet)
2. You should see a welcome page with two buttons
3. Click "Create New Wallet" - UI should load (will fail without backend)
4. Navigate back - should work fine

If you see the welcome page, the app is working! 🎉
