"use client";

import { TopBar } from "@/components/layout/TopBar";
import { mockGateEntries, mockTrucks } from "@/lib/mock-data";
import { useState } from "react";
import {
  QrCode,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  ArrowDownLeft,
  ArrowUpRight,
  Camera,
  Search,
  AlertTriangle,
  X,
} from "lucide-react";
import type { GateEntry } from "@/lib/types";

const gates = [
  { id: "GATE-1", type: "IMPORT", status: "OPEN" },
  { id: "GATE-2", type: "EXPORT", status: "OPEN" },
  { id: "GATE-3", type: "IMPORT", status: "CLOSED" },
  { id: "GATE-4", type: "EXPORT", status: "MAINTENANCE" },
];

export default function GatePage() {
  const [activeGate, setActiveGate] = useState("GATE-1");
  const [scanInput, setScanInput] = useState("");
  const [scanResult, setScanResult] = useState<"success" | "error" | "warning" | null>(null);
  const [scanMessage, setScanMessage] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<GateEntry | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    if (!scanInput.trim()) return;
    setIsScanning(true);
    setTimeout(() => {
      const token = mockTrucks.find(
        (t) => t.tokenNo === scanInput || t.truckNo === scanInput
      );
      if (token) {
        if (token.tokenStatus === "ACTIVE" || token.tokenStatus === "ISSUED") {
          setScanResult("success");
          setScanMessage(`✓ Token verified! Truck ${token.truckNo} — ${token.driverName} — ${token.transporterName}`);
        } else if (token.tokenStatus === "EXPIRED") {
          setScanResult("error");
          setScanMessage(`✗ Token EXPIRED! Truck ${token.truckNo} — Token ${token.tokenNo} has expired.`);
        } else {
          setScanResult("warning");
          setScanMessage(`⚠ Token already used. Truck ${token.truckNo} — Status: ${token.tokenStatus}`);
        }
      } else {
        setScanResult("error");
        setScanMessage(`✗ Invalid QR Code / Token not found: "${scanInput}"`);
      }
      setIsScanning(false);
    }, 800);
  };

  const clearScan = () => {
    setScanInput("");
    setScanResult(null);
    setScanMessage("");
  };

  const gateEntries = mockGateEntries.filter((g) => g.gateNo === activeGate);
  const allEntries = mockGateEntries;

  return (
    <div className="min-h-screen bg-slate-950">
      <TopBar title="Gate Management" subtitle="QR Scanning & Gate Entry/Exit Control" />

      <div className="p-6 space-y-6">
        {/* Gate Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gates.map((gate) => (
            <button
              key={gate.id}
              onClick={() => gate.status === "OPEN" && setActiveGate(gate.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeGate === gate.id
                  ? "bg-blue-900/40 border-blue-600 ring-2 ring-blue-500/50"
                  : gate.status === "OPEN"
                  ? "bg-slate-900 border-slate-700/50 hover:border-slate-600"
                  : "bg-slate-900/50 border-slate-800 opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold text-sm">{gate.id}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    gate.status === "OPEN"
                      ? "bg-emerald-900/60 text-emerald-300"
                      : gate.status === "CLOSED"
                      ? "bg-slate-700 text-slate-400"
                      : "bg-amber-900/60 text-amber-300"
                  }`}
                >
                  {gate.status}
                </span>
              </div>
              <div className="text-slate-400 text-xs">{gate.type} Gate</div>
              {activeGate === gate.id && (
                <div className="text-blue-400 text-xs mt-1 font-medium">● Active</div>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* QR Scanner Panel */}
          <div className="xl:col-span-1 space-y-4">
            {/* Scanner */}
            <div className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-700/50 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-blue-400" />
                <h3 className="text-white font-semibold">QR Scanner — {activeGate}</h3>
              </div>
              <div className="p-5 space-y-4">
                {/* Camera Placeholder */}
                <div className="bg-slate-800 rounded-xl aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-600 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-blue-500/50 rounded-lg relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-400 rounded-tl"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-400 rounded-tr"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-400 rounded-bl"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-400 rounded-br"></div>
                      {isScanning && (
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-400 animate-bounce" style={{ animationDuration: "1s" }}></div>
                      )}
                    </div>
                  </div>
                  <Camera className="w-8 h-8 text-slate-600 relative z-10 mt-24" />
                  <p className="text-slate-500 text-xs mt-2 relative z-10">Camera Feed</p>
                </div>

                {/* Manual Input */}
                <div>
                  <label className="text-slate-400 text-xs mb-1.5 block">Manual Token / QR Input</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={scanInput}
                      onChange={(e) => setScanInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleScan()}
                      placeholder="Enter token no or scan QR..."
                      className="flex-1 bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-500"
                    />
                    <button
                      onClick={handleScan}
                      disabled={isScanning}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
                    >
                      {isScanning ? "..." : "Scan"}
                    </button>
                  </div>
                </div>

                {/* Quick Test Tokens */}
                <div>
                  <p className="text-slate-500 text-xs mb-2">Quick Test:</p>
                  <div className="flex flex-wrap gap-2">
                    {["TKN2024001", "TKN2024002", "TKN2024003"].map((t) => (
                      <button
                        key={t}
                        onClick={() => { setScanInput(t); }}
                        className="text-xs px-2 py-1 bg-slate-800 border border-slate-700 text-slate-400 rounded hover:text-slate-200 hover:border-slate-600"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scan Result */}
                {scanResult && (
                  <div
                    className={`rounded-lg p-4 flex items-start gap-3 ${
                      scanResult === "success"
                        ? "bg-emerald-900/30 border border-emerald-700/50"
                        : scanResult === "warning"
                        ? "bg-amber-900/30 border border-amber-700/50"
                        : "bg-red-900/30 border border-red-700/50"
                    }`}
                  >
                    {scanResult === "success" ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : scanResult === "warning" ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          scanResult === "success"
                            ? "text-emerald-300"
                            : scanResult === "warning"
                            ? "text-amber-300"
                            : "text-red-300"
                        }`}
                      >
                        {scanMessage}
                      </p>
                    </div>
                    <button onClick={clearScan} className="text-slate-500 hover:text-slate-300">
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                {scanResult === "success" && (
                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-700 text-white text-sm rounded-lg hover:bg-emerald-600 transition-all">
                      <ArrowDownLeft size={14} />
                      Gate IN
                    </button>
                    <button className="flex items-center justify-center gap-2 px-3 py-2.5 bg-violet-700 text-white text-sm rounded-lg hover:bg-violet-600 transition-all">
                      <ArrowUpRight size={14} />
                      Gate OUT
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Today's Stats */}
            <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-4">
              <h3 className="text-white font-semibold text-sm mb-3">Today&apos;s Gate Activity</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Gate In", value: 22, icon: ArrowDownLeft, color: "text-blue-400" },
                  { label: "Gate Out", value: 18, icon: ArrowUpRight, color: "text-violet-400" },
                  { label: "Pending", value: 4, icon: Clock, color: "text-amber-400" },
                  { label: "Trucks", value: 34, icon: Truck, color: "text-emerald-400" },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="bg-slate-800 rounded-lg p-3 text-center">
                      <Icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
                      <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                      <div className="text-xs text-slate-500">{s.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Gate Entries Table */}
          <div className="xl:col-span-2 space-y-4">
            {/* Search */}
            <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search truck no, token, driver..."
                  className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-500"
                />
              </div>
            </div>

            {/* All Gate Entries */}
            <div className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
                <h3 className="text-white font-semibold">Gate Entries — Today</h3>
                <div className="flex items-center gap-2">
                  <button className="text-xs px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700">
                    All Gates
                  </button>
                  <button className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {activeGate}
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50 bg-slate-800/50">
                      <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Truck No</th>
                      <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Token</th>
                      <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Driver</th>
                      <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Gate</th>
                      <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Entry Time</th>
                      <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Exit Time</th>
                      <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Containers</th>
                      <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Status</th>
                      <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">QR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allEntries.map((entry) => (
                      <tr
                        key={entry.id}
                        onClick={() => setSelectedEntry(entry)}
                        className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3 font-mono text-amber-300 text-xs">{entry.truckNo}</td>
                        <td className="px-4 py-3 font-mono text-slate-400 text-xs">{entry.tokenNo}</td>
                        <td className="px-4 py-3 text-slate-300 text-xs">{entry.driverName}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                            entry.gateType === "IMPORT" ? "bg-blue-900/60 text-blue-300" : "bg-emerald-900/60 text-emerald-300"
                          }`}>
                            {entry.gateNo}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">
                          {new Date(entry.entryTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">
                          {entry.exitTime
                            ? new Date(entry.exitTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">
                          {entry.containerNos.join(", ")}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            entry.status === "IN"
                              ? "bg-blue-900/60 text-blue-300"
                              : entry.status === "OUT"
                              ? "bg-emerald-900/60 text-emerald-300"
                              : "bg-amber-900/60 text-amber-300"
                          }`}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {entry.qrScanned ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending Trucks */}
            <div className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-700/50">
                <h3 className="text-white font-semibold">Pending Trucks</h3>
              </div>
              <div className="p-4 space-y-3">
                {mockTrucks
                  .filter((t) => t.truckStatus === "PENDING")
                  .map((truck) => (
                    <div key={truck.id} className="bg-slate-800 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-amber-300 text-sm font-bold">{truck.truckNo}</span>
                          <span className="text-xs text-slate-500">Token: {truck.tokenNo}</span>
                        </div>
                        <div className="text-slate-400 text-xs">{truck.driverName} · {truck.transporterName}</div>
                        <div className="text-slate-500 text-xs mt-0.5">
                          Appointment: {truck.appointmentTime
                            ? new Date(truck.appointmentTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
                            : "—"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-amber-900/40 text-amber-300 border border-amber-700/50 rounded-full">
                          {truck.purpose}
                        </span>
                        <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
                          Process
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Entry Detail Modal */}
        {selectedEntry && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg">
              <div className="px-6 py-5 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-white font-bold">Gate Entry Details</h2>
                <button onClick={() => setSelectedEntry(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 grid grid-cols-2 gap-3">
                {[
                  ["Gate No", selectedEntry.gateNo],
                  ["Gate Type", selectedEntry.gateType],
                  ["Truck No", selectedEntry.truckNo],
                  ["Token No", selectedEntry.tokenNo],
                  ["Driver", selectedEntry.driverName],
                  ["Operator", selectedEntry.operatorId],
                  ["Entry Time", new Date(selectedEntry.entryTime).toLocaleString("en-IN")],
                  ["Exit Time", selectedEntry.exitTime ? new Date(selectedEntry.exitTime).toLocaleString("en-IN") : "Still Inside"],
                  ["Containers", selectedEntry.containerNos.join(", ")],
                  ["Weighbridge Slip", selectedEntry.weighbridgeSlip || "—"],
                  ["QR Scanned", selectedEntry.qrScanned ? "Yes" : "No"],
                  ["Remarks", selectedEntry.remarks || "—"],
                ].map(([l, v]) => (
                  <div key={l} className="bg-slate-800 rounded-lg p-3">
                    <div className="text-xs text-slate-500">{l}</div>
                    <div className="text-sm text-slate-200 font-medium mt-0.5">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
