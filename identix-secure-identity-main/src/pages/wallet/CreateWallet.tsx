import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/CopyButton";
import { useWallet } from "@/context/WalletContext";
import { Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const CreateWallet = () => {
  const { createDID, loading } = useWallet();
  const navigate = useNavigate();
  const [result, setResult] = useState<{ did: string; seedPhrase: string } | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleCreate = async () => {
    const res = await createDID();
    setResult(res);
  };

  if (!result) {
    return (
      <AppLayout app="wallet">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-3 text-3xl font-bold">Create your wallet</h1>
          <p className="mb-8 max-w-sm text-muted-foreground">
            Generate a new decentralized identity (DID) secured by a seed phrase.
          </p>
          <Button size="lg" onClick={handleCreate} disabled={loading} className="gap-2 px-8">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Create wallet
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout app="wallet">
      <div className="mx-auto max-w-lg animate-fade-in-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
        <h1 className="mb-6 text-2xl font-bold">Wallet created!</h1>

        {/* Seed phrase */}
        <div className="mb-6 rounded-xl border border-warning/30 bg-warning/5 p-5">
          <div className="mb-3 flex items-center gap-2 text-warning">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">Save your seed phrase</span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {result.seedPhrase.split(" ").map((word, i) => (
              <div key={i} className="rounded-lg border border-border bg-card px-3 py-2 text-center font-mono text-sm">
                <span className="text-muted-foreground mr-1">{i + 1}.</span>
                {word}
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-end">
            <CopyButton text={result.seedPhrase} variant="outline" />
          </div>
        </div>

        {/* DID */}
        <div className="mb-6 rounded-xl border border-border bg-card p-5">
          <p className="mb-2 text-sm font-medium text-muted-foreground">Your DID</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded-lg bg-muted px-3 py-2 font-mono text-sm">
              {result.did}
            </code>
            <CopyButton text={result.did} />
          </div>
        </div>

        {/* Confirm */}
        <div className="flex items-center gap-3 mb-6">
          <Checkbox
            id="confirm"
            checked={confirmed}
            onCheckedChange={(c) => setConfirmed(c === true)}
          />
          <label htmlFor="confirm" className="text-sm cursor-pointer">
            I have saved my seed phrase securely
          </label>
        </div>

        <Button
          size="lg"
          className="w-full"
          disabled={!confirmed}
          onClick={() => navigate("/wallet/credentials")}
        >
          Continue to wallet
        </Button>
      </div>
    </AppLayout>
  );
};

export default CreateWallet;
