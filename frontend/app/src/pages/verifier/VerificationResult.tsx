import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { VerificationResult as VResult } from "@/lib/types";
import { ShieldCheck, ShieldX, ShieldAlert, ArrowLeft } from "lucide-react";

const statusConfig = {
  verified: {
    icon: ShieldCheck,
    title: "Credential Verified",
    desc: "This credential is authentic and valid.",
    glowClass: "glow-success",
    iconColor: "text-success",
  },
  revoked: {
    icon: ShieldAlert,
    title: "Credential Revoked",
    desc: "This credential has been revoked by the issuer.",
    glowClass: "glow-warning",
    iconColor: "text-warning",
  },
  invalid: {
    icon: ShieldX,
    title: "Invalid Credential",
    desc: "This credential could not be verified.",
    glowClass: "glow-destructive",
    iconColor: "text-destructive",
  },
};

const VerificationResultPage = () => {
  const [result, setResult] = useState<VResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("identix-verification-result");
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, []);

  if (!result) {
    return (
      <AppLayout app="verifier">
        <div className="flex flex-col items-center py-20">
          <p className="text-muted-foreground">No verification result found.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/verifier/verify">Verify a credential</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const config = statusConfig[result.status];
  const Icon = config.icon;

  return (
    <AppLayout app="verifier">
      <Link to="/verifier/verify" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to verify
      </Link>

      <div className={`mx-auto max-w-lg rounded-xl border border-border bg-card p-8 text-center animate-scale-in ${config.glowClass}`}>
        <Icon className={`mx-auto mb-4 h-16 w-16 ${config.iconColor}`} />
        <h1 className="mb-2 text-2xl font-bold">{config.title}</h1>
        <p className="mb-2 text-muted-foreground">{config.desc}</p>
        {result.reason && (
          <p className="text-sm text-muted-foreground italic">{result.reason}</p>
        )}

        <div className="mt-4">
          <StatusBadge status={result.status === "verified" ? "verified" : result.status === "revoked" ? "revoked" : "invalid"} />
        </div>

        {result.credential && (
          <div className="mt-6 text-left space-y-3">
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground mb-1">Type</p>
              <p className="font-medium">{result.credential.type} Credential</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground mb-1">Issuer</p>
              <p className="font-medium">{result.credential.issuerName}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground mb-1">Holder</p>
              <p className="font-medium">{result.credential.holderName}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground mb-1">Issued</p>
              <p className="font-medium">{new Date(result.credential.issuedAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Button asChild>
          <Link to="/verifier/verify">Verify another</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/verifier">Back to home</Link>
        </Button>
      </div>
    </AppLayout>
  );
};

export default VerificationResultPage;
