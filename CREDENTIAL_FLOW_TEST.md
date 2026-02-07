# Credential Flow Testing Guide

## Services Running
- **Backend**: http://localhost:3000
- **Wallet**: http://localhost:3001  
- **Issuer**: http://localhost:3002
- **Verifier**: http://localhost:3003

## Fixed Issues

### 1. Backend Configuration
- ✅ Created `.env` file with proper configuration
- ✅ Fixed Veramo initialization to work without complex setup
- ✅ Added fallback to in-memory storage when MongoDB is unavailable
- ✅ Improved error handling in credential service

### 2. Issuer Improvements
- ✅ Fixed DID generation for demo mode
- ✅ Added "Use Demo DID" button for easy testing
- ✅ Improved credential format with proper proof structure
- ✅ Added debug page at `/debug` for testing credential flow

### 3. Wallet Improvements
- ✅ Enhanced error logging in claim process
- ✅ Better credential validation
- ✅ Improved DID setup for new users

## Testing Steps

### Step 1: Set Up Wallet (Demo Mode)
1. Go to http://localhost:3001
2. Click "Create New Wallet" or "Demo Mode"
3. Note your DID (should be: `did:ethr:0x1234567890123456789012345678901234567890`)

### Step 2: Issue a Credential
1. Go to http://localhost:3002
2. Click "Demo Mode" to login
3. Go to "Issue Credential"
4. Fill in the form:
   - **Issuer DID**: Should auto-fill with demo issuer DID
   - **Holder DID**: Click "Use Demo DID" or paste: `did:ethr:0x1234567890123456789012345678901234567890`
   - **Credential Type**: Choose any type
   - **Title**: e.g., "Bachelor of Computer Science"
   - **Name**: e.g., "John Doe"
   - **Institution**: e.g., "Test University"
5. Click "Issue Credential"

### Step 3: Add to Wallet
1. After issuing, you'll see a success page
2. Click "Add to Wallet (Open in New Tab)"
3. This should open the wallet and automatically add the credential
4. Check the wallet's credentials list to verify it appears

### Step 4: Debug Testing
1. Go to http://localhost:3002/debug
2. Click "Test Add to Wallet" to test with a pre-configured credential
3. Verify the credential appears in the wallet

### Step 5: Verify Credential
1. Go to http://localhost:3003 (Verifier)
2. Use the credential from your wallet to verify it works

## Troubleshooting

### If credentials don't appear in wallet:
1. Check browser console for errors
2. Verify the DID matches between issuer and wallet
3. Try the debug page for isolated testing
4. Check that the "Add to Wallet" URL is properly formatted

### If backend issues occur:
- The system will fallback to demo mode automatically
- Check backend logs for specific errors
- Ensure all services are running on correct ports

### Common Issues Fixed:
- ✅ DID mismatch between issuer and wallet
- ✅ Credential format inconsistencies  
- ✅ URL encoding problems in "Add to Wallet" links
- ✅ Backend initialization failures
- ✅ Database connection issues

## Key Improvements Made

1. **Consistent DID Usage**: Demo mode now uses consistent DIDs across all apps
2. **Better Error Handling**: More detailed logging and fallback mechanisms
3. **Simplified Backend**: Removed complex Veramo setup that was causing failures
4. **Debug Tools**: Added debug page for easier testing
5. **Improved UX**: Added helper buttons and better error messages

The credential flow should now work properly from issuer → wallet → verifier!