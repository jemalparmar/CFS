"use client";

import { useState, useMemo } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { mockDeliveryOrders } from "@/lib/mock-data";
import type { DeliveryOrder, DeliveryOrderStatus, DODocument } from "@/lib/types";
import {
  FileText,
  Search,
  Filter,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Package,
  Truck,
  User,
  Building2,
  Calendar,
  MapPin,
  Ship,
  FileCheck,
  Download,
  Printer,
  ChevronRight,
  X,
  CheckSquare,
  Square,
  AlertCircle,
  ClipboardList,
  RotateCcw,
} from "lucide-react";

// ─── Status helpers ────────────────────────────────────────────────────────────

function getStatusVariant(status: DeliveryOrderStatus) {
  switch (status) {
    case "APPROVED": return "success";
    case "RELEASED": return "info";
    case "PENDING": return "warning";
    case "EXPIRED": return "danger";
    case "CANCELLED": return "default";
    default: return "default";
  }
}

function getStatusIcon(status: DeliveryOrderStatus) {
  switch (status) {
    case "APPROVED": return <CheckCircle size={14} className="text-emerald-400" />;
    case "RELEASED": return <Package size={14} className="text-blue-400" />;
    case "PENDING": return <Clock size={14} className="text-amber-400" />;
    case "EXPIRED": return <AlertTriangle size={14} className="text-red-400" />;
    case "CANCELLED": return <XCircle size={14} className="text-slate-400" />;
    default: return null;
  }
}

function getDocTypeLabel(docType: DODocument["docType"]) {
  const labels: Record<DODocument["docType"], string> = {
    BL_COPY: "B/L Copy",
    BE_COPY: "BE Copy",
    OOC_CERT: "OOC Certificate",
    DUTY_RECEIPT: "Duty Receipt",
    ID_PROOF: "ID Proof",
    AUTH_LETTER: "Authority Letter",
    OTHER: "Other",
  };
  return labels[docType] || docType;
}

function getDaysUntilExpiry(validUntil: string): number {
  const today = new Date("2024-01-18");
  const expiry = new Date(validUntil);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── Summary Cards ─────────────────────────────────────────────────────────────

function SummaryCards({ orders }: { orders: DeliveryOrder[] }) {
  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter(o => o.status === "PENDING").length,
    approved: orders.filter(o => o.status === "APPROVED").length,
    released: orders.filter(o => o.status === "RELEASED").length,
    expired: orders.filter(o => o.status === "EXPIRED").length,
    cancelled: orders.filter(o => o.status === "CANCELLED").length,
    pendingDuty: orders.filter(o => !o.dutyPaid && o.status !== "CANCELLED").length,
    pendingDemurrage: orders.filter(o => !o.demurrageCleared && (o.demurrageAmount ?? 0) > 0).length,
  }), [orders]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
      {[
        { label: "Total DOs", value: stats.total, color: "text-slate-200", bg: "bg-slate-700/50" },
        { label: "Pending", value: stats.pending, color: "text-amber-400", bg: "bg-amber-500/10" },
        { label: "Approved", value: stats.approved, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        { label: "Released", value: stats.released, color: "text-blue-400", bg: "bg-blue-500/10" },
        { label: "Expired", value: stats.expired, color: "text-red-400", bg: "bg-red-500/10" },
        { label: "Cancelled", value: stats.cancelled, color: "text-slate-400", bg: "bg-slate-700/50" },
        { label: "Duty Pending", value: stats.pendingDuty, color: "text-orange-400", bg: "bg-orange-500/10" },
        { label: "Demurrage Due", value: stats.pendingDemurrage, color: "text-rose-400", bg: "bg-rose-500/10" },
      ].map((card) => (
        <div key={card.label} className={`${card.bg} rounded-xl p-3 border border-slate-700/50`}>
          <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
          <div className="text-xs text-slate-400 mt-0.5">{card.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── DO Table Row ──────────────────────────────────────────────────────────────

function DOTableRow({ order, onSelect }: { order: DeliveryOrder; onSelect: (o: DeliveryOrder) => void }) {
  const daysLeft = getDaysUntilExpiry(order.validUntil);
  const docsVerified = order.documents.filter(d => d.verified).length;
  const totalDocs = order.documents.length;

  return (
    <tr
      className="border-b border-slate-700/50 hover:bg-slate-700/30 cursor-pointer transition-colors"
      onClick={() => onSelect(order)}
    >
      <td className="px-4 py-3">
        <div className="font-mono text-sm text-blue-400">{order.doNo}</div>
        <div className="text-xs text-slate-500">{order.doDate}</div>
      </td>
      <td className="px-4 py-3">
        <div className="font-mono text-sm text-slate-200">{order.containerNo}</div>
        <div className="text-xs text-slate-500">{order.blNo}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-slate-200 max-w-[160px] truncate">{order.consigneeName}</div>
        <div className="text-xs text-slate-500 truncate">{order.chaName}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-slate-300">{order.commodity}</div>
        <div className="text-xs text-slate-500">{order.containerSize} · {order.containerType}</div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {getStatusIcon(order.status)}
          <Badge variant={getStatusVariant(order.status)} size="sm">{order.status}</Badge>
        </div>
      </td>
      <td className="px-4 py-3">
        {order.status === "PENDING" || order.status === "APPROVED" ? (
          <div className={`text-sm font-medium ${daysLeft <= 1 ? "text-red-400" : daysLeft <= 3 ? "text-amber-400" : "text-emerald-400"}`}>
            {daysLeft > 0 ? `${daysLeft}d left` : "Expired"}
          </div>
        ) : (
          <div className="text-sm text-slate-500">—</div>
        )}
        <div className="text-xs text-slate-500">{order.validUntil}</div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className={`text-xs ${order.dutyPaid ? "text-emerald-400" : "text-red-400"}`}>
            {order.dutyPaid ? "✓ Duty" : "✗ Duty"}
          </div>
          <div className={`text-xs ${order.demurrageCleared ? "text-emerald-400" : "text-amber-400"}`}>
            {order.demurrageCleared ? "✓ Dem." : "✗ Dem."}
          </div>
        </div>
        <div className="text-xs text-slate-500 mt-0.5">{docsVerified}/{totalDocs} docs</div>
      </td>
      <td className="px-4 py-3">
        <button className="text-slate-400 hover:text-blue-400 transition-colors">
          <ChevronRight size={16} />
        </button>
      </td>
    </tr>
  );
}

// ─── DO Detail Drawer ──────────────────────────────────────────────────────────

function DODetailDrawer({ order, onClose }: { order: DeliveryOrder; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"details" | "documents" | "timeline">("details");
  const daysLeft = getDaysUntilExpiry(order.validUntil);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="w-[600px] bg-slate-900 border-l border-slate-700/50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50 bg-slate-800/50">
          <div>
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-blue-400" />
              <span className="font-bold text-slate-100">{order.doNo}</span>
              <Badge variant={getStatusVariant(order.status)} size="sm">{order.status}</Badge>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Issued: {order.doDate} · Valid Until: {order.validUntil}</div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Validity Alert */}
        {(order.status === "PENDING" || order.status === "APPROVED") && daysLeft <= 2 && (
          <div className="mx-4 mt-3 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
            <span className="text-xs text-red-300">
              {daysLeft <= 0 ? "DO has expired!" : `DO expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}!`}
            </span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-slate-700/50 px-4 pt-3">
          {(["details", "documents", "timeline"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === "details" && (
            <>
              {/* Container Info */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-3">
                  <Package size={14} className="text-blue-400" />
                  <span className="text-sm font-semibold text-slate-200">Container Information</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-slate-500">Container No.</div>
                    <div className="font-mono text-slate-200 font-medium">{order.containerNo}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">B/L No.</div>
                    <div className="font-mono text-slate-200">{order.blNo}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">BE No.</div>
                    <div className="font-mono text-slate-200">{order.beNo}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">IGM No.</div>
                    <div className="font-mono text-slate-200">{order.igmNo}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Size / Type</div>
                    <div className="text-slate-200">{order.containerSize} · {order.containerType}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Gross Weight</div>
                    <div className="text-slate-200">{order.grossWeight.toLocaleString()} kg</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Packages</div>
                    <div className="text-slate-200">{order.packages} {order.packageUnit}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Commodity</div>
                    <div className="text-slate-200">{order.commodity}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Yard Location</div>
                    <div className="font-mono text-slate-200">{order.yardLocation}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Port of Loading</div>
                    <div className="text-slate-200">{order.portOfLoading}</div>
                  </div>
                </div>
              </div>

              {/* Vessel Info */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-3">
                  <Ship size={14} className="text-blue-400" />
                  <span className="text-sm font-semibold text-slate-200">Vessel Details</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-slate-500">Vessel Name</div>
                    <div className="text-slate-200">{order.vesselName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Voyage No.</div>
                    <div className="font-mono text-slate-200">{order.voyageNo}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Shipping Line</div>
                    <div className="text-slate-200">{order.shippingLine}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Shipping Line Ref.</div>
                    <div className="font-mono text-slate-200 text-xs">{order.shippingLineRef}</div>
                  </div>
                </div>
              </div>

              {/* Consignee & CHA */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 size={14} className="text-blue-400" />
                  <span className="text-sm font-semibold text-slate-200">Consignee & CHA</span>
                </div>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="p-3 bg-slate-700/30 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">Consignee</div>
                    <div className="text-slate-200 font-medium">{order.consigneeName}</div>
                    <div className="text-xs text-slate-400 mt-1">{order.consigneeAddress}</div>
                    <div className="flex gap-4 mt-1">
                      <span className="text-xs text-slate-500">GSTIN: <span className="font-mono text-slate-300">{order.consigneeGSTIN}</span></span>
                      <span className="text-xs text-slate-500">Ph: <span className="text-slate-300">{order.consigneeContact}</span></span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-700/30 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">CHA (Customs House Agent)</div>
                    <div className="text-slate-200 font-medium">{order.chaName}</div>
                    <div className="flex gap-4 mt-1">
                      <span className="text-xs text-slate-500">Code: <span className="font-mono text-slate-300">{order.chaCode}</span></span>
                      <span className="text-xs text-slate-500">Ph: <span className="text-slate-300">{order.chaContact}</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clearance Status */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-3">
                  <FileCheck size={14} className="text-blue-400" />
                  <span className="text-sm font-semibold text-slate-200">Clearance Status</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-lg border ${order.dutyPaid ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                    <div className="flex items-center gap-2">
                      {order.dutyPaid ? <CheckCircle size={14} className="text-emerald-400" /> : <XCircle size={14} className="text-red-400" />}
                      <span className={`text-sm font-medium ${order.dutyPaid ? "text-emerald-300" : "text-red-300"}`}>
                        Duty {order.dutyPaid ? "Paid" : "Pending"}
                      </span>
                    </div>
                    {order.dutyAmount !== undefined && (
                      <div className="text-xs text-slate-400 mt-1">₹{order.dutyAmount.toLocaleString()}</div>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg border ${order.demurrageCleared ? "bg-emerald-500/10 border-emerald-500/30" : "bg-amber-500/10 border-amber-500/30"}`}>
                    <div className="flex items-center gap-2">
                      {order.demurrageCleared ? <CheckCircle size={14} className="text-emerald-400" /> : <AlertCircle size={14} className="text-amber-400" />}
                      <span className={`text-sm font-medium ${order.demurrageCleared ? "text-emerald-300" : "text-amber-300"}`}>
                        Demurrage {order.demurrageCleared ? "Cleared" : "Due"}
                      </span>
                    </div>
                    {(order.demurrageAmount ?? 0) > 0 && (
                      <div className="text-xs text-slate-400 mt-1">₹{order.demurrageAmount!.toLocaleString()}</div>
                    )}
                  </div>
                  {order.customsOOCDate && (
                    <div className="col-span-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-300">OOC Granted</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">Date: {order.customsOOCDate}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Info (if released) */}
              {order.status === "RELEASED" && (
                <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Truck size={14} className="text-blue-400" />
                    <span className="text-sm font-semibold text-blue-300">Delivery Information</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-xs text-slate-500">Truck No.</div>
                      <div className="font-mono text-slate-200">{order.truckNo}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Token No.</div>
                      <div className="font-mono text-slate-200">{order.tokenNo}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Released By</div>
                      <div className="text-slate-200">{order.releasedBy}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Released At</div>
                      <div className="text-slate-200">{order.releasedAt ? new Date(order.releasedAt).toLocaleString("en-IN") : "—"}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Remarks */}
              {order.remarks && (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="text-xs text-slate-500 mb-1">Remarks</div>
                  <div className="text-sm text-slate-300">{order.remarks}</div>
                </div>
              )}
            </>
          )}

          {activeTab === "documents" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-400">
                  {order.documents.filter(d => d.verified).length} of {order.documents.length} documents verified
                </div>
                <button className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  <Plus size={12} />
                  Upload Document
                </button>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${(order.documents.filter(d => d.verified).length / order.documents.length) * 100}%` }}
                />
              </div>

              {order.documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-3 rounded-xl border flex items-start gap-3 ${
                    doc.verified
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-amber-500/5 border-amber-500/20"
                  }`}
                >
                  <div className="mt-0.5">
                    {doc.verified
                      ? <CheckSquare size={16} className="text-emerald-400" />
                      : <Square size={16} className="text-amber-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-200">{getDocTypeLabel(doc.docType)}</span>
                      <div className="flex items-center gap-2">
                        <button className="text-slate-500 hover:text-slate-300 transition-colors">
                          <Eye size={13} />
                        </button>
                        <button className="text-slate-500 hover:text-slate-300 transition-colors">
                          <Download size={13} />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs font-mono text-slate-400 mt-0.5">{doc.docNo}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500">
                        Uploaded: {new Date(doc.uploadedAt).toLocaleDateString("en-IN")}
                      </span>
                      {doc.verified && doc.verifiedBy && (
                        <span className="text-xs text-emerald-400">✓ Verified by {doc.verifiedBy}</span>
                      )}
                      {!doc.verified && (
                        <span className="text-xs text-amber-400">Pending verification</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Required docs checklist */}
              <div className="mt-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <div className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Required Documents Checklist</div>
                {(["BL_COPY", "BE_COPY", "OOC_CERT", "DUTY_RECEIPT", "AUTH_LETTER"] as DODocument["docType"][]).map((docType) => {
                  const found = order.documents.find(d => d.docType === docType);
                  return (
                    <div key={docType} className="flex items-center gap-2 py-1.5 border-b border-slate-700/30 last:border-0">
                      {found?.verified
                        ? <CheckCircle size={13} className="text-emerald-400 flex-shrink-0" />
                        : found
                        ? <Clock size={13} className="text-amber-400 flex-shrink-0" />
                        : <XCircle size={13} className="text-red-400 flex-shrink-0" />
                      }
                      <span className={`text-xs ${found?.verified ? "text-slate-300" : found ? "text-amber-300" : "text-red-300"}`}>
                        {getDocTypeLabel(docType)}
                      </span>
                      {!found && <span className="text-xs text-red-400 ml-auto">Missing</span>}
                      {found && !found.verified && <span className="text-xs text-amber-400 ml-auto">Pending</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-1">
              {[
                {
                  event: "DO Requested",
                  time: order.doDate + "T09:00:00",
                  by: order.chaName,
                  icon: <FileText size={14} className="text-slate-400" />,
                  color: "border-slate-600",
                },
                ...(order.approvedAt ? [{
                  event: "DO Approved",
                  time: order.approvedAt,
                  by: order.approvedBy ?? "—",
                  icon: <CheckCircle size={14} className="text-emerald-400" />,
                  color: "border-emerald-500",
                }] : []),
                ...(order.releasedAt ? [{
                  event: "Container Released",
                  time: order.releasedAt,
                  by: order.releasedBy ?? "—",
                  icon: <Package size={14} className="text-blue-400" />,
                  color: "border-blue-500",
                }] : []),
                ...(order.status === "EXPIRED" ? [{
                  event: "DO Expired",
                  time: order.validUntil + "T23:59:59",
                  by: "System",
                  icon: <AlertTriangle size={14} className="text-red-400" />,
                  color: "border-red-500",
                }] : []),
                ...(order.status === "CANCELLED" ? [{
                  event: "DO Cancelled",
                  time: order.doDate + "T15:00:00",
                  by: order.consigneeName,
                  icon: <XCircle size={14} className="text-slate-400" />,
                  color: "border-slate-600",
                }] : []),
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full bg-slate-800 border-2 ${item.color} flex items-center justify-center flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div className="w-0.5 bg-slate-700 flex-1 my-1" />
                  </div>
                  <div className="pb-4 flex-1">
                    <div className="text-sm font-medium text-slate-200">{item.event}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {new Date(item.time).toLocaleString("en-IN")} · {item.by}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-700/50 p-4 flex items-center gap-2 bg-slate-800/30">
          {order.status === "PENDING" && (
            <>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors">
                <CheckCircle size={14} />
                Approve DO
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm font-medium rounded-lg border border-red-500/30 transition-colors">
                <XCircle size={14} />
                Reject
              </button>
            </>
          )}
          {order.status === "APPROVED" && (
            <>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
                <Package size={14} />
                Release Container
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 text-sm font-medium rounded-lg border border-amber-500/30 transition-colors">
                <RotateCcw size={14} />
                Extend Validity
              </button>
            </>
          )}
          {order.status === "EXPIRED" && (
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg transition-colors">
              <RotateCcw size={14} />
              Renew DO
            </button>
          )}
          <button className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg transition-colors">
            <Printer size={14} />
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg transition-colors">
            <Download size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── New DO Modal ──────────────────────────────────────────────────────────────

function NewDOModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700/50 rounded-2xl w-[560px] max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <ClipboardList size={18} className="text-blue-400" />
            <span className="font-bold text-slate-100">Issue New Delivery Order</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Container Details */}
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">Container Details</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Container No.", placeholder: "MSCU1234567" },
                { label: "B/L No.", placeholder: "MSCUBL2024001" },
                { label: "BE No.", placeholder: "BE/2024/001234" },
                { label: "IGM No.", placeholder: "IGM/2024/5678" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="text-xs text-slate-400 block mb-1">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Consignee Details */}
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">Consignee Details</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-slate-400 block mb-1">Consignee Name</label>
                <input
                  type="text"
                  placeholder="MUMBAI TRADERS PVT LTD"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">GSTIN</label>
                <input
                  type="text"
                  placeholder="27AABCM1234A1Z5"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Contact No.</label>
                <input
                  type="text"
                  placeholder="9876543210"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* CHA Details */}
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">CHA Details</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">CHA Name</label>
                <input
                  type="text"
                  placeholder="RELIABLE CHA SERVICES"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">CHA Code</label>
                <input
                  type="text"
                  placeholder="CHA/MUM/0234"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Validity */}
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">DO Validity</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Issue Date</label>
                <input
                  type="date"
                  defaultValue="2024-01-18"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Valid Until</label>
                <input
                  type="date"
                  defaultValue="2024-01-25"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Remarks</label>
            <textarea
              rows={2}
              placeholder="Any special instructions or notes..."
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 px-5 py-4 border-t border-slate-700/50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
            Issue Delivery Order
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function DeliveryOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DeliveryOrderStatus | "ALL">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [showNewDO, setShowNewDO] = useState(false);

  const filtered = useMemo(() => {
    return mockDeliveryOrders.filter((o) => {
      const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        o.doNo.toLowerCase().includes(q) ||
        o.containerNo.toLowerCase().includes(q) ||
        o.blNo.toLowerCase().includes(q) ||
        o.consigneeName.toLowerCase().includes(q) ||
        o.chaName.toLowerCase().includes(q) ||
        o.commodity.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter]);

  const statusOptions: Array<{ value: DeliveryOrderStatus | "ALL"; label: string }> = [
    { value: "ALL", label: "All Status" },
    { value: "PENDING", label: "Pending" },
    { value: "APPROVED", label: "Approved" },
    { value: "RELEASED", label: "Released" },
    { value: "EXPIRED", label: "Expired" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <TopBar title="Delivery Order Management" />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-slate-100">Delivery Orders</h1>
              <p className="text-sm text-slate-400 mt-0.5">Manage container release and DO lifecycle</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg transition-colors">
                <Download size={14} />
                Export
              </button>
              <button
                onClick={() => setShowNewDO(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus size={14} />
                Issue New DO
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <SummaryCards orders={mockDeliveryOrders} />

          {/* Filters */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search DO no., container, consignee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg p-1">
              <Filter size={13} className="text-slate-500 ml-1" />
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    statusFilter === opt.value
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-800/80">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">DO No. / Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Container / B/L</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Consignee / CHA</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Commodity</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Validity</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Clearance</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-slate-500">
                        <FileText size={32} className="mx-auto mb-2 opacity-30" />
                        <div>No delivery orders found</div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((order) => (
                      <DOTableRow key={order.id} order={order} onSelect={setSelectedOrder} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-slate-700/50 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Showing {filtered.length} of {mockDeliveryOrders.length} delivery orders
              </div>
              <div className="flex items-center gap-1">
                {["1", "2", "3"].map((p) => (
                  <button
                    key={p}
                    className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                      p === "1" ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Expiry Alerts */}
          {mockDeliveryOrders.some(o => (o.status === "PENDING" || o.status === "APPROVED") && getDaysUntilExpiry(o.validUntil) <= 3) && (
            <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-amber-400" />
                <span className="text-sm font-semibold text-amber-300">Expiry Alerts</span>
              </div>
              <div className="space-y-1">
                {mockDeliveryOrders
                  .filter(o => (o.status === "PENDING" || o.status === "APPROVED") && getDaysUntilExpiry(o.validUntil) <= 3)
                  .map(o => {
                    const days = getDaysUntilExpiry(o.validUntil);
                    return (
                      <div key={o.id} className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">
                          <span className="font-mono text-amber-300">{o.doNo}</span> · {o.consigneeName}
                        </span>
                        <span className={days <= 0 ? "text-red-400" : "text-amber-400"}>
                          {days <= 0 ? "Expired" : `Expires in ${days}d`}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Detail Drawer */}
      {selectedOrder && (
        <DODetailDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}

      {/* New DO Modal */}
      {showNewDO && <NewDOModal onClose={() => setShowNewDO(false)} />}
    </div>
  );
}
