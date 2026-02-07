import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";
import { CheckCircle2, XCircle } from "lucide-react";
import { Credential } from "@/lib/types";

const ClaimCredential = () => {
  const [searchParams] = useSearchParams();
  const { addCredential } = useWallet();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const data = searchParams.get("data");
      if (!data) throw new Error("No credential data in URL");
      const cred: Credential = JSON.parse(decodeURIComponent(data));
      addCredential(cred);
      setStatus("success");
    } catch (e: any) {
      setError(e.message || "Failed to claim credential");
      setStatus("error");
    }
  }, []);

  return (
    <AppLayout app="wallet">
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        {status === "loading" && <p className="text-muted-foreground">Processing...</p>}

        {status === "success" && (
          <div className="animate-scale-in">
            <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-success" />
            <h1 className="mb-2 text-2xl font-bold">Credential added!</h1>
            <p className="mb-6 text-muted-foreground">The credential has been added to your wallet.</p>
            <Button asChild size="lg">
              <Link to="/wallet/credentials">View my credentials</Link>
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="animate-scale-in">
            <XCircle className="mx-auto mb-4 h-16 w-16 text-destructive" />
            <h1 className="mb-2 text-2xl font-bold">Failed to claim</h1>
            <p className="mb-6 text-sm text-muted-foreground">{error}</p>
            <Button asChild variant="outline">
              <Link to="/wallet/credentials">Go to wallet</Link>
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ClaimCredential;
