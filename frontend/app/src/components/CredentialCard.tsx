import { Credential } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { GraduationCap, Briefcase, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";

const typeIcons = {
  Educational: GraduationCap,
  Professional: Briefcase,
  Identity: Fingerprint,
};

interface CredentialCardProps {
  credential: Credential;
  onClick?: () => void;
  className?: string;
}

export const CredentialCard = ({ credential, onClick, className }: CredentialCardProps) => {
  const Icon = typeIcons[credential.type];
  const date = new Date(credential.issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-5 card-hover",
        "before:absolute before:inset-0 before:rounded-xl before:border-2 before:border-transparent before:transition-all before:duration-300",
        "hover:before:border-primary/40",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{credential.type} Credential</h3>
            <p className="text-sm text-muted-foreground">{credential.issuerName}</p>
          </div>
        </div>
        <StatusBadge status={credential.status} />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>Holder: {credential.holderName}</span>
        <span>{date}</span>
      </div>

      {/* Subtle orange line at bottom on hover */}
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
    </div>
  );
};
