import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "revoked" | "verified" | "invalid";
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const styles: Record<string, string> = {
    active: "bg-success/15 text-success border-success/30",
    verified: "bg-success/15 text-success border-success/30",
    revoked: "bg-warning/15 text-warning border-warning/30",
    invalid: "bg-destructive/15 text-destructive border-destructive/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider",
        styles[status],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", {
        "bg-success": status === "active" || status === "verified",
        "bg-warning": status === "revoked",
        "bg-destructive": status === "invalid",
      })} />
      {status}
    </span>
  );
};
