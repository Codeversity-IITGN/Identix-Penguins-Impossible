import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useWallet } from "@/context/WalletContext";
import { Loader2, KeyRound } from "lucide-react";

const RecoverWallet = () => {
  const { recoverDID, loading } = useWallet();
  const navigate = useNavigate();
  const [phrase, setPhrase] = useState("");
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);

  const handleRecover = async () => {
    const words = phrase.trim().split(/\s+/).filter(Boolean);
    if (words.length !== 12) {
      setError("Please enter exactly 12 words.");
      return;
    }
    setError("");
    setVerified(false);
    try {
      await recoverDID(phrase);
      setVerified(true);
      setTimeout(() => navigate("/wallet/credentials"), 800);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Recovery failed. Please check your seed phrase and try again.";
      setError(message);
    }
  };

  return (
    <AppLayout app="wallet">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <KeyRound className="h-7 w-7 text-primary" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Recover your wallet</h1>
        <p className="mb-6 text-muted-foreground">Enter your 12-word seed phrase to restore access.</p>

        <Textarea
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
          placeholder="Enter your 12-word seed phrase separated by spaces..."
          rows={4}
          className="mb-2 font-mono"
        />
        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        {verified && (
          <p className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
            Seed phrase verified. Restoring your wallet…
          </p>
        )}
        <Button size="lg" className="mt-4 w-full gap-2" onClick={handleRecover} disabled={loading || !phrase.trim()}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {verified ? "Redirecting…" : "Verify and recover wallet"}
        </Button>
      </div>
    </AppLayout>
  );
};

export default RecoverWallet;
