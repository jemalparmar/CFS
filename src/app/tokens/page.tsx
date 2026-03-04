"use client";

import { TopBar } from "@/components/layout/TopBar";
import { mockTokens, mockTrucks } from "@/lib/mock-data";
import { useState } from "react";
import { getTokenStatusBadge } from "@/components/ui/Badge";
import {
  Plus,
  QrCode,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  X,
  Printer,
  Search,
  Calendar,
  User,
  Building,
} from "lucide-react";
import type { TruckToken } from "@/lib/types";

export default function TokensPage() {
  const [selectedToken, setSelectedToken] = useState<TruckToken | null>(null);
  const [showNewToken, setShowNewToken] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = mockTokens.filter((t) => {
    const matchSearch =
      !search ||
      t.tokenNo.toLowerCase().includes(search.toLowerCase()) ||
      t.truckNo.toLowerCase().includes(search.toLowerCase()) ||
      t.driverName.toLowerCase().includes(search.toLowerCase()) ||
      t.transporterName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950">
      <TopBar title="Truck Token System" subtitle="Issue & Manage Truck Entry Tokens" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Tokens Today", value: mockTokens.length, color: "text-blue-400", icon: QrCode },
            { label: "Active", value: mockTokens.filter((t) => t.status === "ACTIVE").length, color: "text-emerald-400", icon: CheckCircle },
            { label: "Issued", value: mockTokens.filter((t) => t.status === "ISSUED").length, color: "text-amber-400", icon: Clock },
            { label: "Completed", value: mockTokens.filter((t) => t.status === "COMPLETED").length, color: "text-purple-400", icon: CheckCircle },
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Token List */}
          <div className="xl:col-span-2 space-y-4">
            {/* Filters */}
            <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-4 flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search token, truck, driver..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-500"
                />
              </div>
              <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg p-1">
                {["ALL", "ISSUED", "ACTIVE", "COMPLETED", "EXPIRED"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      statusFilter === s ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowNewToken(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all"
              >
                <Plus size={14} />
                Issue Token
              </button>
            </div>

            {/* Token Cards */}
            <div className="space-y-3">
              {filtered.map((token) => (
                <div
                  key={token.id}
                  onClick={() => setSelectedToken(token)}
                  className="bg-slate-900 border border-slate-700/50 rounded-xl p-5 cursor-pointer hover:border-slate-600 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-blue-300 font-bold text-base">{token.tokenNo}</span>
                        {getTokenStatusBadge(token.status)}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Truck size={12} />
                        <span className="font-mono text-amber-300">{token.truckNo}</span>
                        <span>·</span>
                        <span>{token.driverName}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-400 text-xs">{token.gateAssigned || "No Gate"}</div>
                      <div className="text-slate-500 text-xs mt-0.5">
                        {new Date(token.issuedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-slate-400 text-xs">{token.transporterName}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{token.purpose}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* QR Code Visual */}
                      <div className="w-10 h-10 bg-white rounded p-1 flex items-center justify-center">
                        <div className="grid grid-cols-3 gap-0.5 w-full h-full">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div
                              key={i}
                              className={`rounded-sm ${
                                [0, 2, 6, 8, 4].includes(i) ? "bg-black" : "bg-white"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedToken(token); }}
                        className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg hover:bg-slate-700"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Truck Queue */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-700/50">
                <h3 className="text-white font-semibold">Truck Queue</h3>
              </div>
              <div className="p-4 space-y-3">
                {mockTrucks.map((truck) => (
                  <div key={truck.id} className="bg-slate-800 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-amber-300 text-sm font-bold">{truck.truckNo}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        truck.truckStatus === "GATE_IN"
                          ? "bg-blue-900/60 text-blue-300"
                          : truck.truckStatus === "GATE_OUT"
                          ? "bg-emerald-900/60 text-emerald-300"
                          : truck.truckStatus === "PENDING"
                          ? "bg-amber-900/60 text-amber-300"
                          : "bg-slate-700 text-slate-400"
                      }`}>
                        {truck.truckStatus}
                      </span>
                    </div>
                    <div className="text-slate-400 text-xs">{truck.driverName}</div>
                    <div className="text-slate-500 text-xs">{truck.transporterName}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-500">{truck.purpose}</span>
                      {truck.appointmentTime && (
                        <span className="text-xs text-slate-500">
                          {new Date(truck.appointmentTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Token Detail Modal */}
      {selectedToken && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-white font-bold">Token Details</h2>
              <button onClick={() => setSelectedToken(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* QR Code Display */}
              <div className="flex flex-col items-center bg-white rounded-xl p-6">
                <div className="grid grid-cols-7 gap-1 w-32 h-32">
                  {[1,1,1,0,1,1,1,1,0,0,0,1,0,1,1,0,1,0,1,0,1,1,1,1,0,1,1,1,0,0,0,0,0,0,0,1,0,1,0,1,0,1,1,1,1,0,1,1,1].map((v, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${v ? "bg-black" : "bg-white"}`}
                    />
                  ))}
                </div>
                <div className="text-black text-xs font-mono mt-3 font-bold">{selectedToken.tokenNo}</div>
                <div className="text-gray-500 text-xs mt-0.5">{selectedToken.truckNo}</div>
              </div>

              {/* Token Info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Token No", selectedToken.tokenNo],
                  ["Status", selectedToken.status],
                  ["Truck No", selectedToken.truckNo],
                  ["Gate", selectedToken.gateAssigned || "—"],
                  ["Driver", selectedToken.driverName],
                  ["Transporter", selectedToken.transporterName],
                  ["Issued At", new Date(selectedToken.issuedAt).toLocaleString("en-IN")],
                  ["Valid Until", new Date(selectedToken.validUntil).toLocaleString("en-IN")],
                  ["Purpose", selectedToken.purpose],
                  ["Containers", selectedToken.containerNos.join(", ")],
                ].map(([l, v]) => (
                  <div key={l} className="bg-slate-800 rounded-lg p-3">
                    <div className="text-xs text-slate-500">{l}</div>
                    <div className="text-sm text-slate-200 font-medium mt-0.5 break-all">{v}</div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                  <Printer size={14} />
                  Print Token
                </button>
                {selectedToken.status === "ISSUED" && (
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-700 text-white text-sm rounded-lg hover:bg-red-600">
                    <XCircle size={14} />
                    Cancel Token
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Token Modal */}
      {showNewToken && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg">
            <div className="px-6 py-5 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-white font-bold">Issue New Token</h2>
              <button onClick={() => setShowNewToken(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Truck Number", placeholder: "MH04AB1234", icon: Truck },
                  { label: "Driver Name", placeholder: "Enter driver name", icon: User },
                  { label: "Transporter Name", placeholder: "Company name", icon: Building },
                  { label: "Driver License", placeholder: "License number", icon: User },
                  { label: "Driver Mobile", placeholder: "10-digit mobile", icon: User },
                  { label: "Appointment Time", placeholder: "", icon: Calendar, type: "datetime-local" },
                ].map((field) => {
                  const Icon = field.icon;
                  return (
                    <div key={field.label}>
                      <label className="text-slate-400 text-xs mb-1.5 block">{field.label}</label>
                      <div className="relative">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                        <input
                          type={field.type || "text"}
                          placeholder={field.placeholder}
                          className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1.5 block">Container Numbers (comma separated)</label>
                <input
                  type="text"
                  placeholder="MSCU1234567, TGHU9876543"
                  className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-500"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1.5 block">Purpose</label>
                <select className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500">
                  <option>DELIVERY</option>
                  <option>PICKUP</option>
                  <option>STUFFING</option>
                  <option>DESTUFFING</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowNewToken(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowNewToken(false)}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  Issue Token
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
