/**
 * Shared demo data for IdentiX - ensures coordination between Issuer, Wallet, and Verifier apps.
 * All three apps must use this exact data for demo mode to work correctly.
 */

// Demo Holder (Student/Individual) - used by Wallet
export const DEMO_HOLDER_DID = 'did:ethr:0x1234567890123456789012345678901234567890'
export const DEMO_HOLDER_SEED_PHRASE = 'abandon ability able about above absent absorb abstract absurd abuse access accident'

// Demo Issuer (University/Institute) - used by Issuer
export const DEMO_ISSUER_DID = 'did:ethr:0x9876543210987654321098765432109876543210'
export const DEMO_ISSUER_WALLET = '0x9876543210987654321098765432109876543210'

// Shared credential IDs - used across all apps
export const DEMO_CREDENTIAL_IDS = {
  EDUCATIONAL: 'cred-demo-edu-1',
  PROFESSIONAL: 'cred-demo-pro-1',
}

// Canonical demo credentials - EXACT format for QR sharing and verification
export const DEMO_CREDENTIALS = [
  {
    id: DEMO_CREDENTIAL_IDS.EDUCATIONAL,
    credentialId: DEMO_CREDENTIAL_IDS.EDUCATIONAL,
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiableCredential', 'EducationalCredential'],
    issuer: { id: DEMO_ISSUER_DID },
    credentialSubject: {
      id: DEMO_HOLDER_DID,
      name: 'John Doe',
      degree: 'Bachelor of Science',
      institution: 'IIT Gandhinagar',
      date: '2024-01-15',
      title: 'Bachelor of Science in Computer Science',
    },
    issuanceDate: '2024-01-15T10:00:00Z',
    status: 'active',
  },
  {
    id: DEMO_CREDENTIAL_IDS.PROFESSIONAL,
    credentialId: DEMO_CREDENTIAL_IDS.PROFESSIONAL,
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiableCredential', 'ProfessionalCredential'],
    issuer: { id: DEMO_ISSUER_DID },
    credentialSubject: {
      id: DEMO_HOLDER_DID,
      name: 'John Doe',
      title: 'Software Engineer',
      company: 'Tech Corp',
      date: '2024-06-01',
    },
    issuanceDate: '2024-06-01T10:00:00Z',
    status: 'active',
  },
]

// Demo credentials as issued by Issuer (for IssuedCredentials list)
export const DEMO_ISSUED_CREDENTIALS = DEMO_CREDENTIALS.map((c) => ({
  id: c.id,
  credentialId: c.id,
  type: c.type,
  holder: c.credentialSubject?.id || DEMO_HOLDER_DID,
  credentialSubject: c.credentialSubject,
  issuanceDate: c.issuanceDate,
  status: c.status,
}))

// Demo verification result - matches credential structure for consistency
export const DEMO_VERIFICATION_RESULT = {
  verified: true,
  credential: DEMO_CREDENTIALS[0],
  issuer: DEMO_ISSUER_DID,
  issuanceDate: DEMO_CREDENTIALS[0].issuanceDate,
  errors: [],
}

// Check if a credential is a known demo credential (for local verification when backend unavailable)
export const isDemoCredential = (credential) => {
  if (!credential) return false
  const id = credential.id || credential.credentialId
  const issuer = credential.issuer?.id || credential.issuer
  return (
    Object.values(DEMO_CREDENTIAL_IDS).includes(id) ||
    (issuer === DEMO_ISSUER_DID && credential.credentialSubject?.id === DEMO_HOLDER_DID)
  )
}

// Create verification result for a demo credential
export const createDemoVerificationResult = (credential, isRevoked = false) => ({
  verified: !isRevoked,
  credential,
  issuer: credential?.issuer?.id || credential?.issuer || DEMO_ISSUER_DID,
  issuanceDate: credential?.issuanceDate,
  status: isRevoked ? 'revoked' : 'active',
  reason: isRevoked ? 'Credential has been revoked by the issuer' : null,
  errors: [],
})
