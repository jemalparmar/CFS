"use client";

import { TopBar } from "@/components/layout/TopBar";
import { mockWeighbridgeRecords } from "@/lib/mock-data";
import { useState } from "react";
import {
  Scale,
  Plus,
  Printer,
  Search,
  Download,
  X,
  Truck,
  Package,
  User,
  Clock,
} from "lucide-react";
import type { WeighbridgeRecord } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const weightChartData = mockWeighbridgeRecords.map((r) => ({
  slip: r.slipNo.replace("WB2024", "WB"),
  gross: r.grossWeight / 1000,
  tare: r.tare / 1000,
  net: r.netWeight / 1000,
}));

export default function WeighbridgePage() {
  const [selectedRecord, setSelectedRecord] = useState<WeighbridgeRecord | null>(null);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = mockWeighbridgeRecords.filter(
    (r) =>
      !search ||
      r.truckNo.toLowerCase().includes(search.toLowerCase()) ||
      r.slipNo.toLowerCase().includes(search.toLowerCase()) ||
      r.containerNo?.toLowerCase().includes(search.toLowerCase()) ||
      r.driverName.toLowerCase().includes(search.toLowerCase())
  );

  const totalGross = mockWeighbridgeRecords.reduce((s, r) => s + r.grossWeight, 0);
  const totalNet = mockWeighbridgeRecords.reduce((s, r) => s + r.netWeight, 0);
  const avgGross = Math.round(totalGross / mockWeighbridgeRecords.length);

  return (
    <div className="min-h-screen bg-slate-950">
      <TopBar title="Weighbridge" subtitle="Vehicle Weight Recording & Management" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Weighings Today", value: mockWeighbridgeRecords.length, color: "text-blue-400" },
            { label: "Total Gross (MT)", value: (totalGross / 1000).toFixed(1), color: "text-amber-400" },
            { label: "Total Net (MT)", value: (totalNet / 1000).toFixed(1), color: "text-emerald-400" },
            { label: "Avg Gross (kg)", value: avgGross.toLocaleString(), color: "text-violet-400" },
          ].map((s) => (
            <div key={s.label} className="bg-slate-900 border border-slate-700/50 rounded-xl p-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Live Weighbridge Panel */}
          <div className="space-y-4">
            {/* Live Display */}
            <div className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-700/50 flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-400" />
                <h3 className="text-white font-semibold">Live Weighbridge</h3>
                <span className="ml-auto text-xs px-2 py-0.5 bg-emerald-900/60 text-emerald-300 rounded-full border border-emerald-700/50">
                  ● Online
                </span>
              </div>
              <div className="p-5 space-y-4">
                {/* Weight Display */}
                <div className="bg-slate-950 rounded-xl p-6 text-center border border-slate-700">
                  <div className="text-slate-500 text-xs mb-2 uppercase tracking-wider">Current Reading</div>
                  <div className="text-5xl font-mono font-bold text-emerald-400 tracking-wider">
                    28,500
                  </div>
                  <div className="text-slate-400 text-sm mt-1">kg</div>
                  <div className="flex justify-center gap-6 mt-4 text-xs text-slate-500">
                    <div>
                      <div className="text-slate-400 font-medium">Tare</div>
                      <div className="font-mono text-amber-400">8,000 kg</div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-medium">Net</div>
                      <div className="font-mono text-blue-400">20,500 kg</div>
                    </div>
                  </div>
                </div>

                {/* Current Truck */}
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="text-slate-400 text-xs mb-2">Current Vehicle</div>
                  <div className="font-mono text-amber-300 font-bold text-base">MH04AB1234</div>
                  <div className="text-slate-400 text-xs mt-1">Ramesh Kumar · FAST LOGISTICS PVT LTD</div>
                  <div className="text-slate-500 text-xs mt-0.5">Container: MSCU1234567</div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowNewEntry(true)}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    <Scale size={14} />
                    Record Weight
                  </button>
                  <button className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg hover:bg-slate-700">
                    <Printer size={14} />
                    Print Slip
                  </button>
                </div>
              </div>
            </div>

            {/* Weight Chart */}
            <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4 text-sm">Today&apos;s Weighings (MT)</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={weightChartData} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="slip" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} unit="t" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                    formatter={(v: number | undefined) => [`${v ?? 0} MT`]}
                  />
                  <Bar dataKey="gross" name="Gross" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="net" name="Net" fill="#22c55e" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: Records Table */}
          <div className="xl:col-span-2 space-y-4">
            {/* Search & Actions */}
            <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-4 flex gap-3 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search slip no, truck, container..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-500"
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg hover:bg-slate-700">
                <Download size={14} />
                Export
              </button>
              <button
                onClick={() => setShowNewEntry(true)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                <Plus size={14} />
                New Entry
              </button>
            </div>

            {/* Records Table */}
            <div className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-700/50">
                <h3 className="text-white font-semibold">Weighbridge Records</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50 bg-slate-800/50">
                      <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Slip No</th>
                      <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Truck No</th>
                      <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Driver</th>
                      <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Container</th>
                      <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Gross (kg)</th>
                      <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Tare (kg)</th>
                      <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Net (kg)</th>
                      <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Purpose</th>
                      <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Time</th>
                      <th className="text-left text-slate-400 font-medium px-4 py-3 text-xs">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((record) => (
                      <tr
                        key={record.id}
                        onClick={() => setSelectedRecord(record)}
                        className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3 font-mono text-blue-300 text-xs">{record.slipNo}</td>
                        <td className="px-4 py-3 font-mono text-amber-300 text-xs">{record.truckNo}</td>
                        <td className="px-4 py-3 text-slate-300 text-xs">{record.driverName}</td>
                        <td className="px-4 py-3 font-mono text-slate-400 text-xs">{record.containerNo || "—"}</td>
                        <td className="px-4 py-3 text-slate-200 text-xs font-medium">{record.grossWeight.toLocaleString()}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs">{record.tare.toLocaleString()}</td>
                        <td className="px-4 py-3 text-emerald-400 text-xs font-medium">{record.netWeight.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-300 rounded">
                            {record.purpose}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs">
                          {new Date(record.weighedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedRecord(record); }}
                              className="text-blue-400 hover:text-blue-300 text-xs"
                            >
                              View
                            </button>
                            <button className="text-slate-500 hover:text-slate-300">
                              <Printer size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg">
            <div className="px-6 py-5 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold">Weighbridge Slip</h2>
                <p className="text-slate-400 text-sm font-mono">{selectedRecord.slipNo}</p>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Weight Display */}
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-700">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-slate-500 text-xs mb-1">Gross Weight</div>
                    <div className="text-2xl font-mono font-bold text-blue-400">{selectedRecord.grossWeight.toLocaleString()}</div>
                    <div className="text-slate-500 text-xs">kg</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs mb-1">Tare Weight</div>
                    <div className="text-2xl font-mono font-bold text-amber-400">{selectedRecord.tare.toLocaleString()}</div>
                    <div className="text-slate-500 text-xs">kg</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs mb-1">Net Weight</div>
                    <div className="text-2xl font-mono font-bold text-emerald-400">{selectedRecord.netWeight.toLocaleString()}</div>
                    <div className="text-slate-500 text-xs">kg</div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Truck No", selectedRecord.truckNo],
                  ["Vehicle Type", selectedRecord.vehicleType],
                  ["Driver Name", selectedRecord.driverName],
                  ["Operator", selectedRecord.operatorId],
                  ["Container No", selectedRecord.containerNo || "—"],
                  ["Purpose", selectedRecord.purpose],
                  ["Weighed At", new Date(selectedRecord.weighedAt).toLocaleString("en-IN")],
                  ["Remarks", selectedRecord.remarks || "—"],
                ].map(([l, v]) => (
                  <div key={l} className="bg-slate-800 rounded-lg p-3">
                    <div className="text-xs text-slate-500">{l}</div>
                    <div className="text-sm text-slate-200 font-medium mt-0.5">{v}</div>
                  </div>
                ))}
              </div>

              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                <Printer size={14} />
                Print Weighbridge Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Entry Modal */}
      {showNewEntry && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg">
            <div className="px-6 py-5 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-white font-bold">New Weighbridge Entry</h2>
              <button onClick={() => setShowNewEntry(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Truck Number", placeholder: "MH04AB1234", icon: Truck },
                  { label: "Driver Name", placeholder: "Driver name", icon: User },
                  { label: "Container No", placeholder: "MSCU1234567", icon: Package },
                  { label: "Vehicle Type", placeholder: "TRAILER", icon: Truck },
                  { label: "Gross Weight (kg)", placeholder: "28500", icon: Scale },
                  { label: "Tare Weight (kg)", placeholder: "8000", icon: Scale },
                ].map((field) => {
                  const Icon = field.icon;
                  return (
                    <div key={field.label}>
                      <label className="text-slate-400 text-xs mb-1.5 block">{field.label}</label>
                      <div className="relative">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1.5 block">Purpose</label>
                <select className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500">
                  <option>IMPORT DELIVERY</option>
                  <option>EXPORT STUFFING</option>
                  <option>REEFER DELIVERY</option>
                  <option>EMPTY RETURN</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1.5 block">Remarks</label>
                <textarea
                  rows={2}
                  placeholder="Optional remarks..."
                  className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-500 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowNewEntry(false)} className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg hover:bg-slate-700">
                  Cancel
                </button>
                <button onClick={() => setShowNewEntry(false)} className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                  Save & Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
