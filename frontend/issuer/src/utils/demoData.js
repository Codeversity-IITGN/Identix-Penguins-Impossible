/**
 * Demo data for Issuer - matches Wallet and Verifier for coordination.
 * Keep in sync with wallet and verifier demoData!
 */

export const DEMO_HOLDER_DID = 'did:ethr:0x1234567890123456789012345678901234567890'
export const DEMO_ISSUER_DID = 'did:ethr:0x9876543210987654321098765432109876543210'
export const DEMO_ISSUER_WALLET = '0x9876543210987654321098765432109876543210'
export const DEMO_WALLET_ADDRESS = DEMO_ISSUER_WALLET

export const DEMO_CREDENTIAL_IDS = {
  EDUCATIONAL: 'cred-demo-edu-1',
  PROFESSIONAL: 'cred-demo-pro-1',
}

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

export const DEMO_ISSUED_CREDENTIALS = DEMO_CREDENTIALS.map((c) => ({
  id: c.id,
  credentialId: c.id,
  type: c.type,
  holder: c.credentialSubject?.id || DEMO_HOLDER_DID,
  credentialSubject: c.credentialSubject,
  issuanceDate: c.issuanceDate,
  status: c.status,
}))
