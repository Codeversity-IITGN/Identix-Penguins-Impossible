import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileText, QrCode, Sparkles } from "lucide-react";
import { demoCredentials } from "@/lib/demoData";
import { VerificationResult } from "@/lib/types";

const VerifyCredential = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"paste" | "scan">("paste");
  const [json, setJson] = useState("");
  const [loading, setLoading] = useState(false);

  const loadSample = () => {
    setJson(JSON.stringify(demoCredentials[0], null, 2));
  };

  const loadRevokedSample = () => {
    setJson(JSON.stringify(demoCredentials[3], null, 2));
  };

  const handleVerify = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    try {
      const cred = JSON.parse(json);
      let result: VerificationResult;

      if (cred.status === "revoked") {
        result = { status: "revoked", credential: cred, reason: "This credential has been revoked by the issuer." };
      } else if (cred.signature && cred.issuerDID) {
        result = { status: "verified", credential: cred };
      } else {
        result = { status: "invalid", reason: "Missing signature or issuer information." };
      }

      sessionStorage.setItem("identix-verification-result", JSON.stringify(result));
      navigate("/verifier/result");
    } catch {
      sessionStorage.setItem(
        "identix-verification-result",
        JSON.stringify({ status: "invalid", reason: "Invalid JSON format." })
      );
      navigate("/verifier/result");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout app="verifier">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-6 text-2xl font-bold">Verify a Credential</h1>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-lg border border-border bg-muted p-1">
          <button
            onClick={() => setTab("paste")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors gap-2 inline-flex items-center justify-center ${
              tab === "paste" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="h-4 w-4" /> Paste JSON
          </button>
          <button
            onClick={() => setTab("scan")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors gap-2 inline-flex items-center justify-center ${
              tab === "scan" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <QrCode className="h-4 w-4" /> Scan QR
          </button>
        </div>

        {tab === "paste" ? (
          <div className="space-y-4">
            <Textarea
              value={json}
              onChange={(e) => setJson(e.target.value)}
              placeholder='Paste credential JSON here...'
              rows={12}
              className="font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadSample} className="gap-2">
                <Sparkles className="h-3 w-3" /> Load valid sample
              </Button>
              <Button variant="outline" size="sm" onClick={loadRevokedSample} className="gap-2">
                <Sparkles className="h-3 w-3" /> Load revoked sample
              </Button>
            </div>
            <Button size="lg" className="w-full gap-2" onClick={handleVerify} disabled={loading || !json.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Verify credential
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-border">
            <QrCode className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="text-muted-foreground">Camera-based QR scanning</p>
            <p className="text-sm text-muted-foreground mt-1">Coming soon — use Paste JSON for now.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default VerifyCredential;
