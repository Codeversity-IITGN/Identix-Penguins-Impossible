import { Credential } from "./types";

export const DEMO_DID = "did:ethr:0x742d35Cc6634C0532925a3b844Bc9e7595f2bD68";
export const DEMO_ISSUER_DID = "did:ethr:0x8Ba1f109551bD432803012645Ac136ddd64DBA72";

export const DEMO_SEED_PHRASE = "abandon ability able about above absent absorb abstract absurd abuse access accident";

export const demoCredentials: Credential[] = [
  {
    id: "cred-001",
    type: "Educational",
    issuerDID: DEMO_ISSUER_DID,
    issuerName: "MIT University",
    holderDID: DEMO_DID,
    holderName: "Alice Johnson",
    issuedAt: "2024-06-15T10:00:00Z",
    expiresAt: "2029-06-15T10:00:00Z",
    status: "active",
    subject: {
      degree: "Bachelor of Science",
      field: "Computer Science",
      graduationDate: "2024-05-20",
      gpa: "3.85",
    },
    signature: "0xabc123...def456",
  },
  {
    id: "cred-002",
    type: "Professional",
    issuerDID: "did:ethr:0x9Cd2F3E55C123456789abcdef0123456789ABCDE",
    issuerName: "Google Inc.",
    holderDID: DEMO_DID,
    holderName: "Alice Johnson",
    issuedAt: "2025-01-10T14:30:00Z",
    status: "active",
    subject: {
      title: "Software Engineer",
      department: "Cloud Platform",
      startDate: "2024-07-01",
      employeeId: "G-78234",
    },
    signature: "0x789abc...123def",
  },
  {
    id: "cred-003",
    type: "Identity",
    issuerDID: "did:ethr:0xABc456789DEF0123456789abcdef0123456789ab",
    issuerName: "Government ID Authority",
    holderDID: DEMO_DID,
    holderName: "Alice Johnson",
    issuedAt: "2023-03-01T09:00:00Z",
    expiresAt: "2033-03-01T09:00:00Z",
    status: "active",
    subject: {
      fullName: "Alice Marie Johnson",
      dateOfBirth: "1998-04-12",
      nationality: "United States",
      documentNumber: "ID-2023-78456",
    },
    signature: "0xdef789...abc012",
  },
  {
    id: "cred-004",
    type: "Educational",
    issuerDID: DEMO_ISSUER_DID,
    issuerName: "MIT University",
    holderDID: DEMO_DID,
    holderName: "Alice Johnson",
    issuedAt: "2023-08-20T11:00:00Z",
    status: "revoked",
    subject: {
      degree: "Certificate",
      field: "Blockchain Development",
      completionDate: "2023-08-15",
    },
    signature: "0x456def...789abc",
  },
];

export const generateDID = (): string => {
  const hex = Array.from({ length: 40 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
  return `did:ethr:0x${hex}`;
};

export const generateCredentialId = (): string => {
  return `cred-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
};
