import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Wallet, Building2, ShieldCheck, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
  app: "wallet" | "issuer" | "verifier";
}

const appConfig = {
  wallet: { label: "Wallet", icon: Wallet, base: "/wallet" },
  issuer: { label: "Issuer", icon: Building2, base: "/issuer" },
  verifier: { label: "Verifier", icon: ShieldCheck, base: "/verifier" },
};

export const AppLayout = ({ children, app }: AppLayoutProps) => {
  const config = appConfig[app];
  const Icon = config.icon;
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <div className="h-5 w-px bg-border" />
            <Link to={config.base} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold tracking-tight">
                Identi<span className="text-primary">X</span>{" "}
                <span className="text-muted-foreground font-normal">{config.label}</span>
              </span>
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
};
