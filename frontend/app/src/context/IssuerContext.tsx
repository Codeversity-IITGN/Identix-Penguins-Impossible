import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { Credential } from "@/lib/types";
import { demoCredentials, DEMO_ISSUER_DID } from "@/lib/demoData";
import { api, mapBackendCredentialToFrontend } from "@/lib/api";

interface IssuerContextType {
  issuerDID: string | null;
  isConnected: boolean;
  issuedCredentials: Credential[];
  connect: () => Promise<void>;
  disconnect: () => void;
  issueCredential: (
    data: Omit<
      Credential,
      "id" | "issuerDID" | "issuerName" | "issuedAt" | "status" | "signature"
    >
  ) => Promise<Credential>;
  revokeCredential: (id: string, reason?: string) => Promise<void>;
  refreshCredentials: () => Promise<void>;
}

const IssuerContext = createContext<IssuerContextType | null>(null);

export const useIssuer = () => {
  const ctx = useContext(IssuerContext);
  if (!ctx) throw new Error("useIssuer must be used within IssuerProvider");
  return ctx;
};

const typeToBackend = (t: Credential["type"]) =>
  t === "Educational"
    ? "EducationalCredential"
    : t === "Professional"
      ? "ProfessionalCredential"
      : "IdentityCredential";

export const IssuerProvider = ({ children }: { children: ReactNode }) => {
  const [issuerDID, setIssuerDID] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [issuedCredentials, setIssuedCredentials] = useState<Credential[]>([]);

  const loadIssued = useCallback(async (did: string) => {
    try {
      const list = await api.getCredentialsByIssuer(did);
      setIssuedCredentials(list);
    } catch {
      setIssuedCredentials(
        demoCredentials.filter((c) => c.issuerDID === DEMO_ISSUER_DID)
      );
    }
  }, []);

  const connect = useCallback(async () => {
    setIssuerDID(DEMO_ISSUER_DID);
    setIsConnected(true);
    await loadIssued(DEMO_ISSUER_DID);
  }, [loadIssued]);

  const disconnect = useCallback(() => {
    setIssuerDID(null);
    setIsConnected(false);
    setIssuedCredentials([]);
  }, []);

  const issueCredential = useCallback(
    async (
      data: Omit<
        Credential,
        "id" | "issuerDID" | "issuerName" | "issuedAt" | "status" | "signature"
      > & { holderClaimKey?: string }
    ): Promise<Credential> => {
      if (!issuerDID) throw new Error("Not connected as issuer");
      const payload: {
        issuerDID: string;
        holderDID?: string;
        holderClaimKey?: string;
        type: string[];
        credentialSubject: Record<string, unknown>;
      } = {
        issuerDID,
        type: ["VerifiableCredential", typeToBackend(data.type)],
        credentialSubject: {
          name: data.holderName,
          ...data.subject,
        },
      };
      if (data.holderClaimKey) {
        payload.holderClaimKey = data.holderClaimKey;
      } else if (data.holderDID) {
        payload.holderDID = data.holderDID;
        payload.credentialSubject = { id: data.holderDID, ...payload.credentialSubject };
      } else {
        throw new Error("Either holderClaimKey or holderDID is required");
      }
      const backend = await api.issueCredential(payload);
      const cred = mapBackendCredentialToFrontend(backend);
      setIssuedCredentials((prev) => [cred, ...prev]);
      return cred;
    },
    [issuerDID]
  );

  const revokeCredential = useCallback(async (id: string, reason?: string) => {
    try {
      await api.revokeCredential(id, reason);
      setIssuedCredentials((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "revoked" as const } : c))
      );
    } catch {
      setIssuedCredentials((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "revoked" as const } : c))
      );
    }
  }, []);

  const refreshCredentials = useCallback(async () => {
    if (issuerDID) await loadIssued(issuerDID);
  }, [issuerDID, loadIssued]);

  return (
    <IssuerContext.Provider
      value={{
        issuerDID,
        isConnected,
        issuedCredentials,
        connect,
        disconnect,
        issueCredential,
        revokeCredential,
        refreshCredentials,
      }}
    >
      {children}
    </IssuerContext.Provider>
  );
};
