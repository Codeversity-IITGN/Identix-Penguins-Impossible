import { useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/CopyButton";
import { useIssuer } from "@/context/IssuerContext";
import { Loader2, CheckCircle2, Send, List } from "lucide-react";
import { Credential } from "@/lib/types";

const IssueCredential = () => {
  const { issuerDID, issueCredential } = useIssuer();
  const [loading, setLoading] = useState(false);
  const [issued, setIssued] = useState<Credential | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    holderClaimKey: "",
    holderName: "",
    type: "Educational" as Credential["type"],
    degree: "",
    field: "",
    institution: "",
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const cred = await issueCredential({
        type: form.type,
        holderClaimKey: form.holderClaimKey,
        holderName: form.holderName,
        subject: {
          degree: form.degree,
          field: form.field,
          institution: form.institution,
        },
      });
      setIssued(cred);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to issue credential");
    } finally {
      setLoading(false);
    }
  };

  if (issued) {
    const claimUrl = `/wallet/claim?data=${encodeURIComponent(JSON.stringify(issued))}`;
    return (
      <AppLayout app="issuer">
        <div className="mx-auto max-w-lg text-center animate-scale-in">
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-success" />
          <h1 className="mb-2 text-2xl font-bold">Credential issued!</h1>
          <p className="mb-6 text-muted-foreground">Share the claim link with the holder.</p>

          <div className="rounded-xl border border-border bg-card p-4 mb-6">
            <p className="text-xs text-muted-foreground mb-2">Claim URL</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg bg-muted px-3 py-2 font-mono text-xs">{claimUrl}</code>
              <CopyButton text={window.location.origin + claimUrl} />
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={() => { setIssued(null); setForm({ holderClaimKey: "", holderName: "", type: "Educational", degree: "", field: "", institution: "" }); }}>
              Issue another
            </Button>
            <Button asChild variant="outline">
              <Link to="/issuer/credentials">View issued</Link>
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout app="issuer">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Issue Credential</h1>
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to="/issuer/credentials"><List className="h-4 w-4" /> Issued list</Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Issuer DID */}
          <div>
            <Label className="text-muted-foreground text-xs">Issuer DID</Label>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 truncate rounded-lg border border-border bg-muted px-3 py-2 font-mono text-sm">{issuerDID}</code>
              <CopyButton text={issuerDID || ""} />
            </div>
          </div>

          <div>
            <Label htmlFor="holderClaimKey">Holder claim key</Label>
            <Input id="holderClaimKey" value={form.holderClaimKey} onChange={(e) => { setError(null); update("holderClaimKey", e.target.value); }} placeholder="One-time encrypted key from holder" className="mt-1 font-mono" required />
            <p className="text-xs text-muted-foreground mt-1">Holder generates this in Wallet → Generate claim key (2FA: DID + email OTP). Valid for one use only.</p>
          </div>

          <div>
            <Label htmlFor="holderName">Holder Name</Label>
            <Input id="holderName" value={form.holderName} onChange={(e) => update("holderName", e.target.value)} placeholder="Alice Johnson" className="mt-1" required />
          </div>

          <div>
            <Label htmlFor="type">Credential Type</Label>
            <select
              id="type"
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="Educational">Educational</option>
              <option value="Professional">Professional</option>
              <option value="Identity">Identity</option>
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="degree">Degree / Title</Label>
              <Input id="degree" value={form.degree} onChange={(e) => update("degree", e.target.value)} placeholder="Bachelor of Science" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="field">Field / Department</Label>
              <Input id="field" value={form.field} onChange={(e) => update("field", e.target.value)} placeholder="Computer Science" className="mt-1" />
            </div>
          </div>

          <div>
            <Label htmlFor="institution">Institution</Label>
            <Input id="institution" value={form.institution} onChange={(e) => update("institution", e.target.value)} placeholder="MIT University" className="mt-1" />
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <Button type="submit" size="lg" className="w-full gap-2" disabled={loading || !form.holderClaimKey}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Issue credential
          </Button>
        </form>
      </div>
    </AppLayout>
  );
};

export default IssueCredential;
