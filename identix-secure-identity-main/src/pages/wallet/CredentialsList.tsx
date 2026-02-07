import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { CredentialCard } from "@/components/CredentialCard";
import { CopyButton } from "@/components/CopyButton";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Inbox, RefreshCw, LogOut } from "lucide-react";
import { DEMO_DID, demoCredentials } from "@/lib/demoData";

const CredentialsList = () => {
  const { did, credentials, refreshCredentials, loading, logout } = useWallet();
  const navigate = useNavigate();

  // Demo mode: if no DID set, use demo
  const activeDid = did || DEMO_DID;
  const activeCredentials = credentials.length > 0 ? credentials : (did ? [] : demoCredentials);

  useEffect(() => {
    if (did) refreshCredentials();
  }, [did]);

  return (
    <AppLayout app="wallet">
      {/* DID display */}
      <div className="mb-8 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Your DID</p>
            <code className="block truncate font-mono text-sm">{activeDid}</code>
          </div>
          <div className="flex items-center gap-1">
            <CopyButton text={activeDid} />
            {did && (
              <Button variant="ghost" size="icon" onClick={() => { logout(); navigate("/wallet"); }} className="h-8 w-8">
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Credentials</h1>
        <Button variant="ghost" size="sm" onClick={refreshCredentials} disabled={loading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {activeCredentials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Inbox className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h2 className="mb-2 text-lg font-semibold">No credentials yet</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Share your DID with issuers to receive verifiable credentials.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {activeCredentials.map((cred, i) => (
            <div key={cred.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
              <CredentialCard
                credential={cred}
                onClick={() => navigate(`/wallet/credential/${cred.id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default CredentialsList;
