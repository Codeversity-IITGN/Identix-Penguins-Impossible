export interface Credential {
  id: string;
  type: "Educational" | "Professional" | "Identity";
  issuerDID: string;
  issuerName: string;
  holderDID: string;
  holderName: string;
  issuedAt: string;
  expiresAt?: string;
  status: "active" | "revoked";
  subject: Record<string, string>;
  signature?: string;
}

export type VerificationStatus = "verified" | "revoked" | "invalid";

export interface VerificationResult {
  status: VerificationStatus;
  credential?: Credential;
  reason?: string;
}
