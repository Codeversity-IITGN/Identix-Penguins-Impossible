import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Wallet, Building2, ShieldCheck, ArrowRight } from "lucide-react";

const portals = [
  {
    key: "wallet",
    label: "Wallet",
    desc: "Create your decentralized identity, store and share verifiable credentials.",
    icon: Wallet,
    href: "/wallet",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    key: "issuer",
    label: "Issuer",
    desc: "Issue verifiable credentials to holders as a university, employer, or authority.",
    icon: Building2,
    href: "/issuer",
    gradient: "from-primary/15 to-primary/5",
  },
  {
    key: "verifier",
    label: "Verifier",
    desc: "Instantly verify credentials with cryptographic proof and revocation checks.",
    icon: ShieldCheck,
    href: "/verifier",
    gradient: "from-primary/10 to-primary/5",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      <div className="relative z-10">
        <header className="flex items-center justify-between px-6 py-4">
          <div />
          <ThemeToggle />
        </header>

        <main className="flex min-h-[85vh] flex-col items-center justify-center px-4">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Decentralized Identity Platform
          </div>

          <h1 className="mb-4 text-center text-5xl font-bold tracking-tight sm:text-7xl animate-fade-in" style={{ animationDelay: "0.1s", opacity: 0 }}>
            Identi<span className="text-gradient-orange">X</span>
          </h1>

          <p className="mb-12 max-w-lg text-center text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: "0.2s", opacity: 0 }}>
            Create, issue, and verify decentralized credentials
            <br />
            with cryptographic security.
          </p>

          <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
            {portals.map((p, i) => (
              <Link
                key={p.key}
                to={p.href}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 card-hover animate-fade-in-up"
                style={{ animationDelay: `${0.3 + i * 0.1}s`, opacity: 0 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <p.icon className="h-6 w-6" />
                  </div>
                  <h2 className="mb-2 text-lg font-semibold">{p.label}</h2>
                  <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Open <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
