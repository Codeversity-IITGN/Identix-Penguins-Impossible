import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { Credential } from "@/lib/types";
import { demoCredentials, DEMO_DID, DEMO_SEED_PHRASE, generateDID } from "@/lib/demoData";
import { api, mapBackendCredentialToFrontend } from "@/lib/api";

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

  const loadCredentials = useCallback(async (holderDid: string) => {
    try {
      const list = await api.getCredentialsByHolder(holderDid);
      setCredentials(list);
    } catch {
      if (holderDid === DEMO_DID) {
        setCredentials(demoCredentials);
      } else {
        setCredentials([]);
      }
    }
  }, []);

  const createDID = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.createDID();
      const newDid = res.did;
      setDid(newDid);
      localStorage.setItem("identix-did", newDid);
      await loadCredentials(newDid);
      setLoading(false);
      return { did: newDid, seedPhrase: DEMO_SEED_PHRASE };
    } catch {
      const newDid = generateDID();
      setDid(newDid);
      localStorage.setItem("identix-did", newDid);
      setCredentials([]);
      setLoading(false);
      return { did: newDid, seedPhrase: DEMO_SEED_PHRASE };
    }
  }, [loadCredentials]);

  const recoverDID = useCallback(
    async (seedPhrase: string) => {
      setLoading(true);
      try {
        const res = await api.recoverDID(seedPhrase.trim());
        const recovered = res.did;
        setDid(recovered);
        localStorage.setItem("identix-did", recovered);
        await loadCredentials(recovered);
      } catch {
        const recovered =
          seedPhrase.trim() === DEMO_SEED_PHRASE ? DEMO_DID : generateDID();
        setDid(recovered);
        localStorage.setItem("identix-did", recovered);
        if (recovered === DEMO_DID) {
          setCredentials(demoCredentials);
        } else {
          setCredentials([]);
        }
      }
      setLoading(false);
    },
    [loadCredentials]
  );

  const refreshCredentials = useCallback(async () => {
    if (!did) return;
    setLoading(true);
    await loadCredentials(did);
    setLoading(false);
  }, [did, loadCredentials]);

  useEffect(() => {
    if (did) loadCredentials(did);
  }, [did, loadCredentials]);

  const addCredential = useCallback((cred: Credential) => {
    setCredentials((prev) => {
      if (prev.some((c) => c.id === cred.id)) return prev;
      return [...prev, cred];
    });
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
      value={{
        did,
        credentials,
        loading,
        createDID,
        recoverDID,
        refreshCredentials,
        addCredential,
        getCredential,
        logout,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export { mapBackendCredentialToFrontend };
