import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { CredentialCard } from "@/components/CredentialCard";
import { Button } from "@/components/ui/button";
import { useIssuer } from "@/context/IssuerContext";
import { Plus, Inbox } from "lucide-react";

const IssuedCredentials = () => {
  const { issuedCredentials } = useIssuer();

  return (
    <AppLayout app="issuer">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Issued Credentials</h1>
        <Button asChild size="sm" className="gap-2">
          <Link to="/issuer/issue"><Plus className="h-4 w-4" /> Issue new</Link>
        </Button>
      </div>

      {issuedCredentials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Inbox className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h2 className="mb-2 text-lg font-semibold">No credentials issued</h2>
          <p className="text-sm text-muted-foreground">Start by issuing your first credential.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {issuedCredentials.map((cred, i) => (
            <div key={cred.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
              <CredentialCard credential={cred} onClick={() => {}} />
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default IssuedCredentials;
