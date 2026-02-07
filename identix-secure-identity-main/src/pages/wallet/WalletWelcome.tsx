import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Wallet, KeyRound, Sparkles } from "lucide-react";

const WalletWelcome = () => {
  return (
    <AppLayout app="wallet">
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 animate-pulse-glow">
          <Wallet className="h-10 w-10 text-primary" />
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Your digital identity
          <br />
          <span className="text-gradient-orange">wallet.</span>
        </h1>

        <p className="mb-10 max-w-md text-lg text-muted-foreground">
          Securely store, manage, and share your verifiable credentials.
          Own your identity.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="gap-2 px-8">
            <Link to="/wallet/create">
              <KeyRound className="h-4 w-4" />
              Create new wallet
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 px-8">
            <Link to="/wallet/recover">
              <Sparkles className="h-4 w-4" />
              Recover wallet
            </Link>
          </Button>
        </div>

        <Link
          to="/wallet/credentials"
          className="mt-6 text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline transition-colors"
        >
          Try demo mode →
        </Link>
      </div>
    </AppLayout>
  );
};

export default WalletWelcome;
