import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { useIssuer } from "@/context/IssuerContext";
import { Loader2, Plug, Sparkles } from "lucide-react";

const IssuerLogin = () => {
  const { connect, isConnected } = useIssuer();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected) navigate("/issuer/issue");
  }, [isConnected]);

  const handleConnect = async () => {
    setLoading(true);
    await connect();
    setLoading(false);
  };

  return (
    <AppLayout app="issuer">
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 animate-pulse-glow">
          <Plug className="h-10 w-10 text-primary" />
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Credential <span className="text-gradient-orange">Issuer</span>
        </h1>
        <p className="mb-10 max-w-md text-lg text-muted-foreground">
          Issue verifiable credentials to holders. Connect your wallet to get started.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="gap-2 px-8" onClick={handleConnect} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plug className="h-4 w-4" />}
            Connect MetaMask
          </Button>
          <Button variant="outline" size="lg" className="gap-2 px-8" onClick={handleConnect} disabled={loading}>
            <Sparkles className="h-4 w-4" />
            Try demo mode
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default IssuerLogin;
