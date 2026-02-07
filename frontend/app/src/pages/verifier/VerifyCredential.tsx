import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileText, QrCode, Sparkles } from "lucide-react";
import { demoCredentials } from "@/lib/demoData";
import { VerificationResult } from "@/lib/types";
import { api, mapBackendCredentialToFrontend } from "@/lib/api";

/** Normalize pasted credential to backend shape for /credentials/verify */
function toBackendCredential(cred: Record<string, unknown>): Record<string, unknown> {
  if (cred.issuerDID != null && cred.credentialSubject == null) {
    return {
      id: cred.id,
      issuer: cred.issuerDID,
      credentialSubject: { id: cred.holderDID, name: cred.holderName, ...(cred.subject as object) },
      issuanceDate: cred.issuedAt,
      type: cred.type,
      status: cred.status,
    };
  }
  return cred;
}

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
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(json);
    } catch {
      sessionStorage.setItem(
        "identix-verification-result",
        JSON.stringify({ status: "invalid" as const, reason: "Invalid JSON format." })
      );
      navigate("/verifier/result");
      setLoading(false);
      return;
    }

    try {
      const payload = toBackendCredential(parsed);
      const res = await api.verifyCredential(payload);
      const status: VerificationResult["status"] = res.verified
        ? "verified"
        : (res.status === "revoked" || /revoked/i.test(res.reason || ""))
          ? "revoked"
          : "invalid";
      const credential = res.credential
        ? mapBackendCredentialToFrontend(res.credential as Parameters<typeof mapBackendCredentialToFrontend>[0])
        : parsed.issuerDID
          ? (parsed as VerificationResult["credential"])
          : undefined;
      const result: VerificationResult = {
        status,
        credential,
        reason: res.reason ?? undefined,
      };
      sessionStorage.setItem("identix-verification-result", JSON.stringify(result));
      navigate("/verifier/result");
    } catch {
      let result: VerificationResult;
      if (parsed.status === "revoked") {
        result = {
          status: "revoked",
          credential: parsed as VerificationResult["credential"],
          reason: "This credential has been revoked by the issuer.",
        };
      } else if (parsed.signature && parsed.issuerDID) {
        result = { status: "verified", credential: parsed as VerificationResult["credential"] };
      } else {
        result = { status: "invalid", reason: "Missing signature or issuer information." };
      }
      sessionStorage.setItem("identix-verification-result", JSON.stringify(result));
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
