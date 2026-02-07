import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useIssuer } from "@/context/IssuerContext";
import { Loader2, Ban, CheckCircle2 } from "lucide-react";

const RevokeCredential = () => {
  const { revokeCredential } = useIssuer();
  const [credId, setCredId] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleRevoke = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await revokeCredential(credId, reason);
    setDone(true);
    setLoading(false);
  };

  if (done) {
    return (
      <AppLayout app="issuer">
        <div className="mx-auto max-w-lg text-center py-20 animate-scale-in">
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-warning" />
          <h1 className="mb-2 text-2xl font-bold">Credential revoked</h1>
          <p className="mb-6 text-muted-foreground">The credential has been marked as revoked.</p>
          <Button onClick={() => { setDone(false); setCredId(""); setReason(""); }}>Revoke another</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout app="issuer">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-6 text-2xl font-bold">Revoke Credential</h1>
        <form onSubmit={handleRevoke} className="space-y-5">
          <div>
            <Label htmlFor="credId">Credential ID</Label>
            <Input id="credId" value={credId} onChange={(e) => setCredId(e.target.value)} placeholder="cred-001" className="mt-1 font-mono" required />
          </div>
          <div>
            <Label htmlFor="reason">Reason (optional)</Label>
            <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for revocation..." className="mt-1" rows={3} />
          </div>
          <Button type="submit" size="lg" className="w-full gap-2" variant="destructive" disabled={loading || !credId}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
            Revoke credential
          </Button>
        </form>
      </div>
    </AppLayout>
  );
};

export default RevokeCredential;
