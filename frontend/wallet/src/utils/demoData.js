/**
 * Demo data for Wallet - matches Issuer and Verifier for coordination.
 * Keep in sync with issuer and verifier demoData!
 */

export const DEMO_HOLDER_DID = 'did:ethr:0x1234567890123456789012345678901234567890'
export const DEMO_HOLDER_SEED_PHRASE = 'abandon ability able about above absent absorb abstract absurd abuse access accident'
export const DEMO_ISSUER_DID = 'did:ethr:0x9876543210987654321098765432109876543210'

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

export const DEMO_DID = DEMO_HOLDER_DID
export const DEMO_SEED_PHRASE = DEMO_HOLDER_SEED_PHRASE

export const isDemoCredential = (credential) => {
  if (!credential) return false
  const id = credential.id || credential.credentialId
  const issuer = credential.issuer?.id || credential.issuer
  return (
    Object.values(DEMO_CREDENTIAL_IDS).includes(id) ||
    (issuer === DEMO_ISSUER_DID && credential.credentialSubject?.id === DEMO_HOLDER_DID)
  )
}

export const isDemoMode = () => localStorage.getItem('identix_demo_mode') === 'true'

export const enableDemoMode = () => {
  localStorage.setItem('identix_demo_mode', 'true')
  localStorage.setItem('identix_did', DEMO_HOLDER_DID)
  localStorage.setItem('identix_seed_phrase', DEMO_HOLDER_SEED_PHRASE)
}

export const disableDemoMode = () => localStorage.removeItem('identix_demo_mode')
