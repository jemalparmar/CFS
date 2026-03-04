"use client";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple" | "orange";
  size?: "sm" | "md";
}

const variantClasses = {
  default: "bg-slate-700 text-slate-200",
  success: "bg-emerald-900/60 text-emerald-300 border border-emerald-700/50",
  warning: "bg-amber-900/60 text-amber-300 border border-amber-700/50",
  danger: "bg-red-900/60 text-red-300 border border-red-700/50",
  info: "bg-blue-900/60 text-blue-300 border border-blue-700/50",
  purple: "bg-purple-900/60 text-purple-300 border border-purple-700/50",
  orange: "bg-orange-900/60 text-orange-300 border border-orange-700/50",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
};

export function Badge({ children, variant = "default", size = "md" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {children}
    </span>
  );
}

export function getContainerStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: BadgeProps["variant"] }> = {
    ARRIVED: { label: "Arrived", variant: "orange" },
    IN_YARD: { label: "In Yard", variant: "info" },
    CUSTOMS_HOLD: { label: "Customs Hold", variant: "danger" },
    CLEARED: { label: "Cleared", variant: "success" },
    DELIVERED: { label: "Delivered", variant: "purple" },
    STUFFING: { label: "Stuffing", variant: "warning" },
    DESTUFFING: { label: "Destuffing", variant: "warning" },
  };
  const item = map[status] || { label: status, variant: "default" as const };
  return <Badge variant={item.variant}>{item.label}</Badge>;
}

export function getTokenStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: BadgeProps["variant"] }> = {
    ISSUED: { label: "Issued", variant: "info" },
    ACTIVE: { label: "Active", variant: "success" },
    COMPLETED: { label: "Completed", variant: "purple" },
    EXPIRED: { label: "Expired", variant: "danger" },
  };
  const item = map[status] || { label: status, variant: "default" as const };
  return <Badge variant={item.variant}>{item.label}</Badge>;
}

export function getInvoiceStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: BadgeProps["variant"] }> = {
    DRAFT: { label: "Draft", variant: "default" },
    ISSUED: { label: "Issued", variant: "info" },
    PAID: { label: "Paid", variant: "success" },
    OVERDUE: { label: "Overdue", variant: "danger" },
    CANCELLED: { label: "Cancelled", variant: "warning" },
  };
  const item = map[status] || { label: status, variant: "default" as const };
  return <Badge variant={item.variant}>{item.label}</Badge>;
}

export function getIceGateStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: BadgeProps["variant"] }> = {
    FILED: { label: "Filed", variant: "info" },
    ASSESSED: { label: "Assessed", variant: "warning" },
    OOC: { label: "Out of Charge", variant: "success" },
    HOLD: { label: "Hold", variant: "danger" },
    EXAMINATION: { label: "Examination", variant: "orange" },
  };
  const item = map[status] || { label: status, variant: "default" as const };
  return <Badge variant={item.variant}>{item.label}</Badge>;
}
