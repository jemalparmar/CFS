"use client";

import { TopBar } from "@/components/layout/TopBar";
import { mockIceGateEntries } from "@/lib/mock-data";
import { useState } from "react";
import { getIceGateStatusBadge } from "@/components/ui/Badge";
import {
  FileCheck,
  Search,
  Download,
  Plus,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  FileText,
  Globe,
} from "lucide-react";
import type { IceGateEntry } from "@/lib/types";

const cbicNotices = [
  {
    id: "N001",
    title: "Circular No. 12/2024 - CBIC",
    description: "Amendment to CFS handling procedures for perishable goods",
    date: "2024-01-15",
    type: "CIRCULAR",
    urgent: false,
  },
  {
    id: "N002",
    title: "Instruction No. 03/2024 - DRI",
    description: "Enhanced examination of electronic goods from specific origins",
    date: "2024-01-12",
    type: "INSTRUCTION",
    urgent: true,
  },
  {
    id: "N003",
    title: "Trade Notice - JNCH",
    description: "Revised free time norms for CFS at JNPT effective 01-Feb-2024",
    date: "2024-01-10",
    type: "TRADE NOTICE",
    urgent: false,
  },
];

const complianceChecks = [
  { label: "ICEGATE Integration", status: "OK", detail: "Connected to CBIC portal" },
  { label: "BE Filing Compliance", status: "OK", detail: "All BEs filed within 30 days" },
  { label: "Examination Pending", status: "WARN", detail: "1 container pending examination" },
  { label: "Duty Payment", status: "OK", detail: "All assessed duties paid" },
  { label: "FSSAI Compliance", status: "WARN", detail: "1 food item pending FSSAI clearance" },
  { label: "BIS Compliance", status: "OK", detail: "All BIS certificates verified" },
  { label: "CDSCO Compliance", status: "OK", detail: "Pharma imports cleared" },
  { label: "Hazmat Declaration", status: "OK", detail: "All IMDG declarations filed" },
];

export default function IceGatePage() {
  const [selectedEntry, setSelectedEntry] = useState<IceGateEntry | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState<"entries" | "compliance" | "reports">("entries");

  const filtered = mockIceGateEntries.filter((e) => {
    const matchSearch =
      !search ||
      e.beNo.toLowerCase().includes(search.toLowerCase()) ||
      e.containerNo.toLowerCase().includes(search.toLowerCase()) ||
      e.blNo.toLowerCase().includes(search.toLowerCase()) ||
      e.importerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const oocCount = mockIceGateEntries.filter((e) => e.status === "OOC").length;
  const holdCount = mockIceGateEntries.filter((e) => e.status === "HOLD").length;
  const examCount = mockIceGateEntries.filter((e) => e.status === "EXAMINATION").length;
  const totalDuty = mockIceGateEntries.reduce((s, e) => s + e.dutyAmount, 0);

  return (
    <div className="min-h-screen bg-slate-950">
      <TopBar title="ICEGATE / CBIC Compliance" subtitle="Customs Integration & Regulatory Compliance" />

      <div className="p-6 space-y-6">
        {/* ICEGATE Status Banner */}
        <div className="bg-emerald-900/20 border border-emerald-700/40 rounded-xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-900/60 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-emerald-300 font-semibold text-sm">ICEGATE Connection Active</div>
              <div className="text-emerald-500 text-xs">Connected to CBIC ICEGATE Portal — NHAVA SHEVA SEA (INNSHL)</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-emerald-400 text-xs font-medium">Last Sync</div>
              <div className="text-emerald-500 text-xs">2 minutes ago</div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/40 border border-emerald-700/50 text-emerald-300 text-xs rounded-lg hover:bg-emerald-900/60">
              <RefreshCw size={12} />
              Sync Now
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total BEs", value: mockIceGateEntries.length, color: "text-blue-400", icon: FileText },
            { label: "Out of Charge", value: oocCount, color: "text-emerald-400", icon: CheckCircle },
            { label: "On Hold", value: holdCount, color: "text-red-400", icon: AlertTriangle },
            { label: "Under Examination", value: examCount, color: "text-amber-400", icon: Clock },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-slate-900 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/50 rounded-xl p-1 w-fit">
          {[
            { id: "entries", label: "BE Entries" },
            { id: "compliance", label: "Compliance" },
            { id: "reports", label: "Reports" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "entries" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* BE List */}
            <div className="xl:col-span-2 space-y-4">
              {/* Filters */}
              <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-4 flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search BE No, container, BL, importer..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-500"
                  />
                </div>
                <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg p-1">
                  {["ALL", "FILED", "ASSESSED", "OOC", "HOLD", "EXAMINATION"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                        statusFilter === s ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg hover:bg-slate-700">
                    <Download size={14} />
                    Export
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                    <Plus size={14} />
                    New BE
                  </button>
                </div>
              </div>

              {/* BE Table */}
              <div className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/50 bg-slate-800/50">
                        <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">BE No</th>
                        <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">IGM No</th>
                        <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Container</th>
                        <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Importer</th>
                        <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">HS Code</th>
                        <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Assessed Value</th>
                        <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Duty</th>
                        <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Status</th>
                        <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">CHA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((entry) => (
                        <tr
                          key={entry.id}
                          onClick={() => setSelectedEntry(entry)}
                          className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors cursor-pointer"
                        >
                          <td className="px-4 py-3 font-mono text-blue-300 text-xs">{entry.beNo}</td>
                          <td className="px-4 py-3 font-mono text-slate-400 text-xs">{entry.igmNo}</td>
                          <td className="px-4 py-3 font-mono text-amber-300 text-xs">{entry.containerNo}</td>
                          <td className="px-4 py-3 text-slate-300 text-xs max-w-32 truncate">{entry.importerName}</td>
                          <td className="px-4 py-3 font-mono text-slate-400 text-xs">{entry.hsCode}</td>
                          <td className="px-4 py-3 text-slate-300 text-xs">
                            &#8377;{(entry.assessedValue / 100000).toFixed(2)}L
                          </td>
                          <td className="px-4 py-3 text-xs">
                            {entry.dutyAmount > 0 ? (
                              <span className="text-red-400 font-medium">&#8377;{(entry.dutyAmount / 1000).toFixed(1)}K</span>
                            ) : (
                              <span className="text-emerald-400">Nil</span>
                            )}
                          </td>
                          <td className="px-4 py-3">{getIceGateStatusBadge(entry.status)}</td>
                          <td className="px-4 py-3 text-slate-500 text-xs max-w-24 truncate">{entry.chaName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* BE Detail */}
            <div className="space-y-4">
              {selectedEntry ? (
                <div className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
                    <h3 className="text-white font-semibold text-sm">BE Details</h3>
                    <button onClick={() => setSelectedEntry(null)} className="text-slate-400 hover:text-white">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="p-4 space-y-4 max-h-screen overflow-y-auto">
                    <div className="flex items-center gap-2">
                      {getIceGateStatusBadge(selectedEntry.status)}
                      {selectedEntry.status === "HOLD" && (
                        <span className="text-xs text-red-400 flex items-center gap-1">
                          <AlertTriangle size={12} /> Action Required
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {[
                        ["BE No", selectedEntry.beNo],
                        ["BE Date", selectedEntry.beDate],
                        ["IGM No", selectedEntry.igmNo],
                        ["IGM Date", selectedEntry.igmDate],
                        ["Line No", selectedEntry.lineNo],
                        ["Container No", selectedEntry.containerNo],
                        ["BL No", selectedEntry.blNo],
                      ].map(([l, v]) => (
                        <div key={l} className="flex justify-between text-xs bg-slate-800 rounded px-3 py-2">
                          <span className="text-slate-500">{l}</span>
                          <span className="text-slate-200 font-mono font-medium">{v}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-700 pt-3">
                      <div className="text-slate-400 text-xs uppercase tracking-wider mb-2">Importer</div>
                      <div className="space-y-2">
                        {[
                          ["Name", selectedEntry.importerName],
                          ["IEC", selectedEntry.importerIEC],
                          ["GSTIN", selectedEntry.importerGSTIN],
                          ["CHA", selectedEntry.chaName],
                          ["CHA Code", selectedEntry.chaCode],
                        ].map(([l, v]) => (
                          <div key={l} className="flex justify-between text-xs bg-slate-800 rounded px-3 py-2">
                            <span className="text-slate-500">{l}</span>
                            <span className="text-slate-200 font-medium truncate max-w-32">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-700 pt-3">
                      <div className="text-slate-400 text-xs uppercase tracking-wider mb-2">Goods & Valuation</div>
                      <div className="space-y-2">
                        {[
                          ["Commodity", selectedEntry.commodity],
                          ["HS Code", selectedEntry.hsCode],
                          ["Quantity", `${selectedEntry.quantity} ${selectedEntry.unit}`],
                          ["Currency", selectedEntry.currency],
                          ["CIF Value", `${selectedEntry.currency} ${selectedEntry.cif.toLocaleString()}`],
                          ["Exchange Rate", `1 ${selectedEntry.currency} = ₹${selectedEntry.exchangeRate}`],
                          ["Assessed Value", `₹${selectedEntry.assessedValue.toLocaleString()}`],
                          ["Duty Amount", selectedEntry.dutyAmount > 0 ? `₹${selectedEntry.dutyAmount.toLocaleString()}` : "Nil"],
                        ].map(([l, v]) => (
                          <div key={l} className="flex justify-between text-xs bg-slate-800 rounded px-3 py-2">
                            <span className="text-slate-500">{l}</span>
                            <span className="text-slate-200 font-medium">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedEntry.oocDate && (
                      <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <div>
                            <div className="text-emerald-300 text-xs font-medium">Out of Charge</div>
                            <div className="text-emerald-500 text-xs">{selectedEntry.oocDate}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedEntry.examOrder && (
                      <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          <div>
                            <div className="text-amber-300 text-xs font-medium">Examination Order</div>
                            <div className="text-amber-500 text-xs">{selectedEntry.examOrder}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedEntry.remarks && (
                      <div className="bg-slate-800 rounded-lg p-3">
                        <div className="text-slate-500 text-xs mb-1">Remarks</div>
                        <div className="text-slate-300 text-xs">{selectedEntry.remarks}</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-700/50 rounded-xl h-64 flex flex-col items-center justify-center">
                  <FileCheck className="w-10 h-10 text-slate-700 mb-2" />
                  <p className="text-slate-500 text-sm">Select a BE to view details</p>
                </div>
              )}

              {/* CBIC Notices */}
              <div className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-700/50">
                  <h3 className="text-white font-semibold text-sm">CBIC Notices</h3>
                </div>
                <div className="p-4 space-y-3">
                  {cbicNotices.map((notice) => (
                    <div
                      key={notice.id}
                      className={`p-3 rounded-lg border ${
                        notice.urgent
                          ? "bg-red-900/20 border-red-700/40"
                          : "bg-slate-800 border-slate-700/50"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className={`text-xs font-medium ${notice.urgent ? "text-red-300" : "text-slate-300"}`}>
                          {notice.title}
                        </span>
                        {notice.urgent && (
                          <span className="text-xs px-1.5 py-0.5 bg-red-900/60 text-red-300 rounded">URGENT</span>
                        )}
                      </div>
                      <p className="text-slate-500 text-xs">{notice.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-600">{notice.date}</span>
                        <span className="text-xs px-2 py-0.5 bg-slate-700 text-slate-400 rounded">{notice.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "compliance" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-700/50">
                <h3 className="text-white font-semibold">Compliance Checklist</h3>
              </div>
              <div className="p-4 space-y-3">
                {complianceChecks.map((check) => (
                  <div key={check.label} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      {check.status === "OK" ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      )}
                      <div>
                        <div className="text-slate-200 text-sm">{check.label}</div>
                        <div className="text-slate-500 text-xs">{check.detail}</div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      check.status === "OK"
                        ? "bg-emerald-900/60 text-emerald-300"
                        : "bg-amber-900/60 text-amber-300"
                    }`}>
                      {check.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-5">
                <h3 className="text-white font-semibold mb-4">Duty Summary</h3>
                <div className="space-y-3">
                  {[
                    { label: "Total Assessed Value", value: `₹${(mockIceGateEntries.reduce((s, e) => s + e.assessedValue, 0) / 100000).toFixed(2)}L` },
                    { label: "Total Duty Collected", value: `₹${(totalDuty / 1000).toFixed(1)}K` },
                    { label: "Duty Exemptions", value: `${mockIceGateEntries.filter((e) => e.dutyAmount === 0).length} BEs` },
                    { label: "Pending Duty Payment", value: "₹0" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                      <span className="text-slate-400 text-sm">{item.label}</span>
                      <span className="text-white font-bold text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-5">
                <h3 className="text-white font-semibold mb-4">Regulatory Agencies</h3>
                <div className="space-y-2">
                  {[
                    { name: "CBIC / Customs", status: "Active", color: "emerald" },
                    { name: "FSSAI", status: "1 Pending", color: "amber" },
                    { name: "BIS", status: "Active", color: "emerald" },
                    { name: "CDSCO", status: "Active", color: "emerald" },
                    { name: "DGFT", status: "Active", color: "emerald" },
                    { name: "Plant Quarantine", status: "Active", color: "emerald" },
                  ].map((agency) => (
                    <div key={agency.name} className="flex items-center justify-between p-2.5 bg-slate-800 rounded-lg">
                      <span className="text-slate-300 text-sm">{agency.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        agency.color === "emerald"
                          ? "bg-emerald-900/60 text-emerald-300"
                          : "bg-amber-900/60 text-amber-300"
                      }`}>
                        {agency.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Daily BE Report", desc: "All BEs filed today with status", icon: FileText },
              { title: "Examination Report", desc: "Containers under examination", icon: AlertTriangle },
              { title: "OOC Report", desc: "Out of charge containers", icon: CheckCircle },
              { title: "Duty Collection Report", desc: "Duty collected this month", icon: FileCheck },
              { title: "Hold Container Report", desc: "Containers on customs hold", icon: Clock },
              { title: "CHA Performance Report", desc: "CHA-wise filing statistics", icon: Globe },
            ].map((report) => {
              const Icon = report.icon;
              return (
                <div key={report.title} className="bg-slate-900 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 cursor-pointer transition-all">
                  <div className="w-10 h-10 bg-blue-900/40 rounded-lg flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{report.title}</h3>
                  <p className="text-slate-500 text-xs mb-4">{report.desc}</p>
                  <button className="flex items-center gap-2 text-blue-400 text-xs hover:text-blue-300">
                    <Download size={12} />
                    Download Report
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
