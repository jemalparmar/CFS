"use client";

import { TopBar } from "@/components/layout/TopBar";
import { mockContainers } from "@/lib/mock-data";
import { useState } from "react";
import { getContainerStatusBadge } from "@/components/ui/Badge";
import {
  Search,
  Filter,
  Download,
  Plus,
  X,
  Thermometer,
  Skull,
  ChevronDown,
  ChevronUp,
  MapPin,
  Ship,
  Calendar,
  Package,
  Clock,
} from "lucide-react";
import type { Container } from "@/lib/types";

const statusFilters = ["ALL", "ARRIVED", "IN_YARD", "CUSTOMS_HOLD", "CLEARED", "DELIVERED", "STUFFING"];
const typeFilters = ["ALL", "DRY", "REEFER", "HAZMAT", "OOG", "TANK"];

export default function ContainersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [sortField, setSortField] = useState<keyof Container>("containerNo");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = mockContainers
    .filter((c) => {
      const matchSearch =
        !search ||
        c.containerNo.toLowerCase().includes(search.toLowerCase()) ||
        c.blNo.toLowerCase().includes(search.toLowerCase()) ||
        c.consignee.toLowerCase().includes(search.toLowerCase()) ||
        c.vesselName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "ALL" || c.status === statusFilter;
      const matchType = typeFilter === "ALL" || c.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    })
    .sort((a, b) => {
      const av = String(a[sortField] ?? "");
      const bv = String(b[sortField] ?? "");
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const handleSort = (field: keyof Container) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortIcon = ({ field }: { field: keyof Container }) =>
    sortField === field ? (
      sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
    ) : null;

  return (
    <div className="min-h-screen bg-slate-950">
      <TopBar title="Container Tracking" subtitle="Track all containers in the CFS" />

      <div className="p-6 space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total", value: mockContainers.length, color: "text-blue-400" },
            { label: "In Yard", value: mockContainers.filter((c) => c.status === "IN_YARD").length, color: "text-indigo-400" },
            { label: "On Hold", value: mockContainers.filter((c) => c.status === "CUSTOMS_HOLD").length, color: "text-red-400" },
            { label: "Cleared", value: mockContainers.filter((c) => c.status === "CLEARED").length, color: "text-emerald-400" },
          ].map((s) => (
            <div key={s.label} className="bg-slate-900 border border-slate-700/50 rounded-xl p-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search container no, BL, consignee, vessel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
              <span className="text-slate-400 text-sm">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                {statusFilters.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                {typeFilters.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg hover:bg-slate-700 transition-all">
                <Download size={14} />
                Export
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all">
                <Plus size={14} />
                Add Container
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-700/50 flex items-center justify-between">
            <span className="text-slate-400 text-sm">{filtered.length} containers found</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-800/50">
                  {[
                    { label: "Container No", field: "containerNo" as keyof Container },
                    { label: "BL No", field: "blNo" as keyof Container },
                    { label: "Size/Type", field: "size" as keyof Container },
                    { label: "Status", field: "status" as keyof Container },
                    { label: "Location", field: "yardLocation" as keyof Container },
                    { label: "Consignee", field: "consignee" as keyof Container },
                    { label: "Vessel", field: "vesselName" as keyof Container },
                    { label: "Arrival", field: "arrivalDate" as keyof Container },
                    { label: "Days", field: "daysInYard" as keyof Container },
                    { label: "Customs", field: "customsStatus" as keyof Container },
                  ].map((col) => (
                    <th
                      key={col.field}
                      onClick={() => handleSort(col.field)}
                      className="text-left text-slate-400 font-medium px-4 py-3 text-xs cursor-pointer hover:text-slate-200 select-none"
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        <SortIcon field={col.field} />
                      </div>
                    </th>
                  ))}
                  <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors cursor-pointer"
                    onClick={() => setSelectedContainer(c)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-blue-300 text-xs">{c.containerNo}</span>
                        {c.type === "REEFER" && <Thermometer size={12} className="text-cyan-400" />}
                        {c.isHazmat && <Skull size={12} className="text-red-400" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400 text-xs">{c.blNo}</td>
                    <td className="px-4 py-3">
                      <span className="text-slate-300 text-xs">{c.size}</span>
                      <span className="text-slate-500 text-xs ml-1">/ {c.type}</span>
                    </td>
                    <td className="px-4 py-3">{getContainerStatusBadge(c.status)}</td>
                    <td className="px-4 py-3 font-mono text-slate-400 text-xs">{c.yardLocation || "—"}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs max-w-32 truncate">{c.consignee}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs max-w-28 truncate">{c.vesselName}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{c.arrivalDate}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold ${c.daysInYard > 7 ? "text-red-400" : c.daysInYard > 5 ? "text-amber-400" : "text-slate-300"}`}>
                        {c.daysInYard}d
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs max-w-32 truncate">{c.customsStatus}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedContainer(c); }}
                        className="text-blue-400 hover:text-blue-300 text-xs underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Container Detail Drawer */}
      {selectedContainer && (
        <div className="fixed inset-0 bg-black/60 flex items-start justify-end z-50">
          <div className="bg-slate-900 border-l border-slate-700 w-full max-w-xl h-full overflow-y-auto">
            <div className="px-6 py-5 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <div>
                <h2 className="text-white font-bold text-lg font-mono">{selectedContainer.containerNo}</h2>
                <p className="text-slate-400 text-sm">{selectedContainer.blNo}</p>
              </div>
              <button
                onClick={() => setSelectedContainer(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center gap-3">
                {getContainerStatusBadge(selectedContainer.status)}
                {selectedContainer.type === "REEFER" && (
                  <span className="flex items-center gap-1 text-cyan-300 text-xs bg-cyan-900/30 border border-cyan-700/50 px-2 py-1 rounded-full">
                    <Thermometer size={12} /> {selectedContainer.temperature}°C
                  </span>
                )}
                {selectedContainer.isHazmat && (
                  <span className="flex items-center gap-1 text-red-300 text-xs bg-red-900/30 border border-red-700/50 px-2 py-1 rounded-full">
                    <Skull size={12} /> IMO {selectedContainer.imoClass}
                  </span>
                )}
              </div>

              {/* Container Info */}
              <div>
                <h3 className="text-slate-400 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Package size={12} /> Container Details
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Size", selectedContainer.size],
                    ["Type", selectedContainer.type],
                    ["Gross Weight", `${selectedContainer.grossWeight.toLocaleString()} kg`],
                    ["Tare Weight", `${selectedContainer.tare.toLocaleString()} kg`],
                    ["Net Weight", `${(selectedContainer.grossWeight - selectedContainer.tare).toLocaleString()} kg`],
                    ["Seal No", selectedContainer.sealNo || "—"],
                  ].map(([l, v]) => (
                    <div key={l} className="bg-slate-800 rounded-lg p-3">
                      <div className="text-xs text-slate-500">{l}</div>
                      <div className="text-sm text-slate-200 font-medium mt-0.5">{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vessel Info */}
              <div>
                <h3 className="text-slate-400 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Ship size={12} /> Vessel & Voyage
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Vessel Name", selectedContainer.vesselName],
                    ["Voyage No", selectedContainer.voyageNo],
                    ["Port of Loading", selectedContainer.portOfLoading],
                    ["Port of Discharge", selectedContainer.portOfDischarge],
                  ].map(([l, v]) => (
                    <div key={l} className="bg-slate-800 rounded-lg p-3">
                      <div className="text-xs text-slate-500">{l}</div>
                      <div className="text-sm text-slate-200 font-medium mt-0.5">{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parties */}
              <div>
                <h3 className="text-slate-400 text-xs uppercase tracking-wider mb-3">Parties</h3>
                <div className="space-y-2">
                  <div className="bg-slate-800 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Shipper</div>
                    <div className="text-sm text-slate-200 font-medium mt-0.5">{selectedContainer.shipper}</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Consignee</div>
                    <div className="text-sm text-slate-200 font-medium mt-0.5">{selectedContainer.consignee}</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3">
                    <div className="text-xs text-slate-500">Commodity</div>
                    <div className="text-sm text-slate-200 font-medium mt-0.5">{selectedContainer.commodity}</div>
                  </div>
                </div>
              </div>

              {/* Customs */}
              <div>
                <h3 className="text-slate-400 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Calendar size={12} /> Customs & Dates
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Arrival Date", selectedContainer.arrivalDate],
                    ["Days in Yard", `${selectedContainer.daysInYard} days`],
                    ["Free Time", `${selectedContainer.freeTime} days`],
                    ["Customs Status", selectedContainer.customsStatus],
                    ["BE No", selectedContainer.beNo || "—"],
                    ["IGM No", selectedContainer.igmNo || "—"],
                    ["ICEGATE Ref", selectedContainer.iceGateRef || "—"],
                    ["Line No", selectedContainer.lineNo || "—"],
                  ].map(([l, v]) => (
                    <div key={l} className="bg-slate-800 rounded-lg p-3">
                      <div className="text-xs text-slate-500">{l}</div>
                      <div className="text-sm text-slate-200 font-medium mt-0.5">{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              {selectedContainer.yardLocation && (
                <div>
                  <h3 className="text-slate-400 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                    <MapPin size={12} /> Yard Location
                  </h3>
                  <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
                    <div className="text-2xl font-mono font-bold text-blue-300 text-center">
                      {selectedContainer.yardLocation}
                    </div>
                    <div className="text-center text-slate-400 text-xs mt-1">
                      Row {selectedContainer.row} · Bay {selectedContainer.bay} · Tier {selectedContainer.tier}
                    </div>
                  </div>
                </div>
              )}

              {/* Demurrage Warning */}
              {selectedContainer.daysInYard > selectedContainer.freeTime && (
                <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 flex items-start gap-3">
                  <Clock className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-red-300 text-sm font-medium">Demurrage Applicable</div>
                    <div className="text-red-400/70 text-xs mt-0.5">
                      Container has exceeded free time by {selectedContainer.daysInYard - selectedContainer.freeTime} days.
                      Demurrage charges will apply.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
