import { useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/CopyButton";
import { useWallet } from "@/context/WalletContext";
import { api } from "@/lib/api";
import { Loader2, Key, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { DEMO_DID } from "@/lib/demoData";

const GenerateClaimKey = () => {
  const { did } = useWallet();
  const activeDid = did || DEMO_DID;
  const [step, setStep] = useState<"email" | "otp" | "done">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [claimKey, setClaimKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.requestClaimKeyOtp(activeDid, email.trim());
      if (res.otp) setOtp(res.otp);
      setStep("otp");
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { claimKey: key } = await api.generateClaimKey(activeDid, email.trim(), otp);
      setClaimKey(key);
      setStep("done");
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to generate claim key");
    } finally {
      setLoading(false);
    }
  };

  if (step === "done") {
    return (
      <AppLayout app="wallet">
        <div className="mx-auto max-w-lg text-center animate-scale-in">
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-success" />
          <h1 className="mb-2 text-2xl font-bold">Claim key generated</h1>
          <p className="mb-6 text-muted-foreground">
            Share this one-time key with the issuer. It can only be used once.
          </p>
          <div className="rounded-xl border border-border bg-card p-4 mb-6">
            <p className="text-xs text-muted-foreground mb-2">One-time claim key</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg bg-muted px-3 py-2 font-mono text-xs break-all">
                {claimKey}
              </code>
              <CopyButton text={claimKey} />
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => { setStep("email"); setEmail(""); setOtp(""); setClaimKey(""); setError(""); }}>
              Generate another
            </Button>
            <Button asChild variant="outline">
              <Link to="/wallet/credentials">Back to credentials</Link>
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout app="wallet">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Key className="h-6 w-6" /> Generate claim key
          </h1>
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to="/wallet/credentials">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Generate a one-time encrypted key for issuers. Issuers use this key instead of your DID to issue credentials. The key is valid for single use only.
        </p>

        <div className="mb-6 rounded-xl border border-border bg-card p-4">
          <Label className="text-muted-foreground text-xs">Your DID</Label>
          <code className="block truncate font-mono text-sm mt-1">{activeDid}</code>
        </div>

        {step === "email" && (
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email for OTP
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1"
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Send OTP
            </Button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleGenerateKey} className="space-y-5">
            <div>
              <Label className="mb-2 block">Enter OTP sent to {email}</Label>
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup className="justify-center">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep("email")} disabled={loading}>
                Change email
              </Button>
              <Button type="submit" size="lg" className="flex-1 gap-2" disabled={loading || otp.length !== 6}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                Generate claim key
              </Button>
            </div>
          </form>
        )}
      </div>
    </AppLayout>
  );
};

export default GenerateClaimKey;
