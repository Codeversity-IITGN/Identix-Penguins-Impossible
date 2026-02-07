import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Credential } from "@/lib/types";
import { demoCredentials, DEMO_ISSUER_DID, generateCredentialId } from "@/lib/demoData";

interface IssuerContextType {
  issuerDID: string | null;
  isConnected: boolean;
  issuedCredentials: Credential[];
  connect: () => Promise<void>;
  disconnect: () => void;
  issueCredential: (data: Omit<Credential, "id" | "issuerDID" | "issuerName" | "issuedAt" | "status" | "signature">) => Promise<Credential>;
  revokeCredential: (id: string, reason?: string) => Promise<void>;
  refreshCredentials: () => Promise<void>;
}

const IssuerContext = createContext<IssuerContextType | null>(null);

export const useIssuer = () => {
  const ctx = useContext(IssuerContext);
  if (!ctx) throw new Error("useIssuer must be used within IssuerProvider");
  return ctx;
};

export const IssuerProvider = ({ children }: { children: ReactNode }) => {
  const [issuerDID, setIssuerDID] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [issuedCredentials, setIssuedCredentials] = useState<Credential[]>([]);

  const connect = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 600));
    setIssuerDID(DEMO_ISSUER_DID);
    setIsConnected(true);
    setIssuedCredentials(demoCredentials.filter((c) => c.issuerDID === DEMO_ISSUER_DID));
  }, []);

  const disconnect = useCallback(() => {
    setIssuerDID(null);
    setIsConnected(false);
    setIssuedCredentials([]);
  }, []);

  const issueCredential = useCallback(
    async (data: Omit<Credential, "id" | "issuerDID" | "issuerName" | "issuedAt" | "status" | "signature">) => {
      await new Promise((r) => setTimeout(r, 800));
      const cred: Credential = {
        ...data,
        id: generateCredentialId(),
        issuerDID: issuerDID!,
        issuerName: "Demo Issuer",
        issuedAt: new Date().toISOString(),
        status: "active",
        signature: `0x${Math.random().toString(16).slice(2, 18)}`,
      };
      setIssuedCredentials((prev) => [cred, ...prev]);
      return cred;
    },
    [issuerDID]
  );

  const revokeCredential = useCallback(async (id: string) => {
    await new Promise((r) => setTimeout(r, 600));
    setIssuedCredentials((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "revoked" as const } : c))
    );
  }, []);

  const refreshCredentials = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 400));
  }, []);

  return (
    <IssuerContext.Provider
      value={{ issuerDID, isConnected, issuedCredentials, connect, disconnect, issueCredential, revokeCredential, refreshCredentials }}
    >
      {children}
    </IssuerContext.Provider>
  );
};
