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

  const handleRecover = async () => {
    const words = phrase.trim().split(/\s+/);
    if (words.length !== 12) {
      setError("Please enter exactly 12 words.");
      return;
    }
    setError("");
    await recoverDID(phrase);
    navigate("/wallet/credentials");
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

        <Button size="lg" className="mt-4 w-full gap-2" onClick={handleRecover} disabled={loading || !phrase.trim()}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Recover wallet
        </Button>
      </div>
    </AppLayout>
  );
};

export default RecoverWallet;
