import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, RefreshCw, Zap } from "lucide-react";

const VerifierLanding = () => {
  const features = [
    { icon: Lock, title: "Cryptographic Proof", desc: "Verify credentials using blockchain-backed signatures." },
    { icon: RefreshCw, title: "Revocation Check", desc: "Instantly check if a credential has been revoked." },
    { icon: Zap, title: "Instant Results", desc: "Get verification results in seconds, not days." },
  ];

  return (
    <AppLayout app="verifier">
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 animate-pulse-glow">
          <ShieldCheck className="h-10 w-10 text-primary" />
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Verify credentials
          <br />
          <span className="text-gradient-orange">instantly.</span>
        </h1>

        <p className="mb-10 max-w-md text-lg text-muted-foreground">
          Cryptographically verify any credential in seconds. Check authenticity and revocation status.
        </p>

        <Button asChild size="lg" className="gap-2 px-8 mb-16">
          <Link to="/verifier/verify">
            <ShieldCheck className="h-4 w-4" />
            Verify credential
          </Link>
        </Button>

        <div className="grid gap-6 sm:grid-cols-3 w-full max-w-2xl">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-5 text-center animate-fade-in-up"
              style={{ animationDelay: `${0.2 + i * 0.1}s`, opacity: 0 }}
            >
              <f.icon className="mx-auto mb-3 h-6 w-6 text-primary" />
              <h3 className="mb-1 font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default VerifierLanding;
