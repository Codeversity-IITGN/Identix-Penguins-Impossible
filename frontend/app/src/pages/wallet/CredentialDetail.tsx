import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";
import { demoCredentials } from "@/lib/demoData";
import { ArrowLeft, QrCode, Copy, GraduationCap, Briefcase, Fingerprint } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { Credential } from "@/lib/types";

const typeIcons = {
  Educational: GraduationCap,
  Professional: Briefcase,
  Identity: Fingerprint,
};

const CredentialDetail = () => {
  const { credentialId } = useParams();
  const { getCredential, credentials } = useWallet();
  const [showQR, setShowQR] = useState(false);

  // Try wallet context first, then demo data
  const cred: Credential | undefined =
    getCredential(credentialId!) ||
    credentials.find((c) => c.id === credentialId) ||
    demoCredentials.find((c) => c.id === credentialId);

  if (!cred) {
    return (
      <AppLayout app="wallet">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground">Credential not found.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/wallet/credentials">Back to credentials</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const Icon = typeIcons[cred.type];
  const credJson = JSON.stringify(cred, null, 2);

  return (
    <AppLayout app="wallet">
      <Link
        to="/wallet/credentials"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to credentials
      </Link>

      <div className="rounded-xl border border-border bg-card p-6 animate-scale-in">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{cred.type} Credential</h1>
              <p className="text-sm text-muted-foreground">Issued by {cred.issuerName}</p>
            </div>
          </div>
          <StatusBadge status={cred.status} />
        </div>

        {/* Subject fields */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {Object.entries(cred.subject).map(([key, value]) => (
            <div key={key} className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </p>
              <p className="font-medium">{value}</p>
            </div>
          ))}
        </div>

        {/* Metadata */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground mb-1">Issuer DID</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate font-mono text-xs">{cred.issuerDID}</code>
              <CopyButton text={cred.issuerDID} />
            </div>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground mb-1">Issued</p>
            <p className="text-sm font-medium">{new Date(cred.issuedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setShowQR(!showQR)} variant="outline" className="gap-2">
            <QrCode className="h-4 w-4" /> {showQR ? "Hide" : "Share via"} QR
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => navigator.clipboard.writeText(credJson)}>
            <Copy className="h-4 w-4" /> Copy JSON
          </Button>
        </div>

        {showQR && (
          <div className="mt-6 flex justify-center animate-scale-in">
            <div className="rounded-xl border border-border bg-background p-6">
              <QRCodeSVG value={credJson} size={200} bgColor="transparent" fgColor="hsl(25, 95%, 53%)" />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default CredentialDetail;
