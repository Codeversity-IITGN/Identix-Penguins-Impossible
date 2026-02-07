import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Credential } from "@/lib/types";
import { demoCredentials, DEMO_DID, DEMO_SEED_PHRASE, generateDID } from "@/lib/demoData";

interface WalletContextType {
  did: string | null;
  credentials: Credential[];
  loading: boolean;
  createDID: () => Promise<{ did: string; seedPhrase: string }>;
  recoverDID: (seedPhrase: string) => Promise<void>;
  refreshCredentials: () => Promise<void>;
  addCredential: (credential: Credential) => void;
  getCredential: (id: string) => Credential | undefined;
  logout: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [did, setDid] = useState<string | null>(() => localStorage.getItem("identix-did"));
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(false);

  const createDID = useCallback(async () => {
    setLoading(true);
    // Demo mode: generate locally
    await new Promise((r) => setTimeout(r, 800));
    const newDid = generateDID();
    setDid(newDid);
    localStorage.setItem("identix-did", newDid);
    setCredentials([]);
    setLoading(false);
    return { did: newDid, seedPhrase: DEMO_SEED_PHRASE };
  }, []);

  const recoverDID = useCallback(async (seedPhrase: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    // Demo: use the demo DID if seed matches, else generate new
    const recovered = seedPhrase.trim() === DEMO_SEED_PHRASE ? DEMO_DID : generateDID();
    setDid(recovered);
    localStorage.setItem("identix-did", recovered);
    // Load demo credentials if matching
    if (recovered === DEMO_DID) {
      setCredentials(demoCredentials);
    } else {
      setCredentials([]);
    }
    setLoading(false);
  }, []);

  const refreshCredentials = useCallback(async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    // Demo mode
    if (did === DEMO_DID) {
      setCredentials(demoCredentials);
    }
    setLoading(false);
  }, [did]);

  const addCredential = useCallback((cred: Credential) => {
    setCredentials((prev) => [...prev, cred]);
  }, []);

  const getCredential = useCallback(
    (id: string) => credentials.find((c) => c.id === id),
    [credentials]
  );

  const logout = useCallback(() => {
    setDid(null);
    setCredentials([]);
    localStorage.removeItem("identix-did");
  }, []);

  return (
    <WalletContext.Provider
      value={{ did, credentials, loading, createDID, recoverDID, refreshCredentials, addCredential, getCredential, logout }}
    >
      {children}
    </WalletContext.Provider>
  );
};
