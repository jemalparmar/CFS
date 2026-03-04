"use client";

import { TopBar } from "@/components/layout/TopBar";
import { mockYardBlocks, mockContainers } from "@/lib/mock-data";
import { useState } from "react";
import { getContainerStatusBadge } from "@/components/ui/Badge";
import { Thermometer, Skull, Package, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import type { Container } from "@/lib/types";

const blockColors: Record<string, { bg: string; border: string; label: string; fill: string }> = {
  IMPORT: { bg: "bg-blue-900/40", border: "border-blue-600/60", label: "text-blue-300", fill: "#1e3a5f" },
  EXPORT: { bg: "bg-emerald-900/40", border: "border-emerald-600/60", label: "text-emerald-300", fill: "#14532d" },
  REEFER: { bg: "bg-cyan-900/40", border: "border-cyan-600/60", label: "text-cyan-300", fill: "#164e63" },
  HAZMAT: { bg: "bg-red-900/40", border: "border-red-600/60", label: "text-red-300", fill: "#7f1d1d" },
  EMPTY: { bg: "bg-slate-800/40", border: "border-slate-600/60", label: "text-slate-300", fill: "#1e293b" },
};

export default function YardMapPage() {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [zoom, setZoom] = useState(1);
  const [filter, setFilter] = useState<string>("ALL");

  const selectedBlockData = mockYardBlocks.find((b) => b.id === selectedBlock);
  const blockContainers = selectedBlock
    ? mockContainers.filter((c) => c.yardLocation.startsWith(selectedBlock + "-"))
    : [];

  const filteredContainers = filter === "ALL"
    ? mockContainers
    : mockContainers.filter((c) => c.type === filter || c.status === filter);

  return (
    <div className="min-h-screen bg-slate-950">
      <TopBar title="Yard Map" subtitle="Visual Container Yard Layout" />

      <div className="p-6 space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/50 rounded-lg p-1">
            {["ALL", "IMPORT", "EXPORT", "REEFER", "HAZMAT", "EMPTY"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
              className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-slate-400 text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
              className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Yard Map SVG */}
          <div className="xl:col-span-2 bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
              <h3 className="text-white font-semibold">Yard Layout</h3>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-700 inline-block"></span>Import</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-700 inline-block"></span>Export</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-cyan-700 inline-block"></span>Reefer</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-700 inline-block"></span>Hazmat</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-600 inline-block"></span>Empty</span>
              </div>
            </div>
            <div className="p-4 overflow-auto">
              <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left", transition: "transform 0.2s" }}>
                <svg width="680" height="420" className="select-none">
                  {/* Background grid */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="680" height="420" fill="#0f172a" />
                  <rect width="680" height="420" fill="url(#grid)" />

                  {/* Road */}
                  <rect x="0" y="395" width="680" height="25" fill="#1e293b" />
                  <text x="340" y="411" textAnchor="middle" fill="#475569" fontSize="10">MAIN ROAD</text>

                  {/* Gate */}
                  <rect x="290" y="380" width="100" height="20" fill="#1d4ed8" rx="3" />
                  <text x="340" y="394" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">MAIN GATE</text>

                  {/* Weighbridge */}
                  <rect x="20" y="380" width="80" height="15" fill="#7c3aed" rx="3" />
                  <text x="60" y="391" textAnchor="middle" fill="white" fontSize="8">WEIGHBRIDGE</text>

                  {/* Office */}
                  <rect x="580" y="380" width="80" height="15" fill="#0f766e" rx="3" />
                  <text x="620" y="391" textAnchor="middle" fill="white" fontSize="8">CFS OFFICE</text>

                  {/* Yard Blocks */}
                  {mockYardBlocks.map((block) => {
                    const isSelected = selectedBlock === block.id;
                    const occupancyPct = (block.occupied / block.capacity) * 100;
                    const fillColor =
                      block.type === "IMPORT" ? "#1e3a5f" :
                      block.type === "EXPORT" ? "#14532d" :
                      block.type === "REEFER" ? "#164e63" :
                      block.type === "HAZMAT" ? "#7f1d1d" : "#1e293b";
                    const strokeColor =
                      block.type === "IMPORT" ? "#3b82f6" :
                      block.type === "EXPORT" ? "#22c55e" :
                      block.type === "REEFER" ? "#06b6d4" :
                      block.type === "HAZMAT" ? "#ef4444" : "#475569";

                    return (
                      <g
                        key={block.id}
                        onClick={() => setSelectedBlock(selectedBlock === block.id ? null : block.id)}
                        className="cursor-pointer"
                      >
                        {/* Block background */}
                        <rect
                          x={block.x}
                          y={block.y}
                          width={block.width}
                          height={block.height}
                          fill={fillColor}
                          stroke={isSelected ? "#f59e0b" : strokeColor}
                          strokeWidth={isSelected ? 2.5 : 1.5}
                          rx="6"
                          opacity={0.9}
                        />
                        {/* Occupancy bar */}
                        <rect
                          x={block.x + 4}
                          y={block.y + block.height - 10}
                          width={(block.width - 8) * (occupancyPct / 100)}
                          height={6}
                          fill={occupancyPct > 80 ? "#ef4444" : occupancyPct > 60 ? "#f59e0b" : "#22c55e"}
                          rx="3"
                        />
                        <rect
                          x={block.x + 4}
                          y={block.y + block.height - 10}
                          width={block.width - 8}
                          height={6}
                          fill="none"
                          stroke="#334155"
                          strokeWidth="1"
                          rx="3"
                        />
                        {/* Block label */}
                        <text
                          x={block.x + 10}
                          y={block.y + 20}
                          fill={strokeColor}
                          fontSize="13"
                          fontWeight="bold"
                        >
                          Block {block.id}
                        </text>
                        <text
                          x={block.x + 10}
                          y={block.y + 34}
                          fill="#94a3b8"
                          fontSize="9"
                        >
                          {block.type}
                        </text>
                        <text
                          x={block.x + 10}
                          y={block.y + 46}
                          fill="#64748b"
                          fontSize="9"
                        >
                          {block.occupied}/{block.capacity} TEU
                        </text>
                        {/* Occupancy % */}
                        <text
                          x={block.x + block.width - 10}
                          y={block.y + 20}
                          fill={occupancyPct > 80 ? "#ef4444" : occupancyPct > 60 ? "#f59e0b" : "#22c55e"}
                          fontSize="12"
                          fontWeight="bold"
                          textAnchor="end"
                        >
                          {Math.round(occupancyPct)}%
                        </text>
                        {/* Reefer icon */}
                        {block.type === "REEFER" && (
                          <text x={block.x + block.width - 10} y={block.y + 36} fontSize="14" textAnchor="end">❄️</text>
                        )}
                        {block.type === "HAZMAT" && (
                          <text x={block.x + block.width - 10} y={block.y + 36} fontSize="14" textAnchor="end">☢️</text>
                        )}
                      </g>
                    );
                  })}

                  {/* Container dots for occupied slots */}
                  {mockContainers
                    .filter((c) => c.yardLocation && c.status !== "DELIVERED")
                    .map((c, i) => {
                      const block = mockYardBlocks.find((b) => c.yardLocation.startsWith(b.id + "-"));
                      if (!block) return null;
                      const dotX = block.x + 15 + (i % 8) * 18;
                      const dotY = block.y + 55 + Math.floor(i / 8) * 14;
                      if (dotY > block.y + block.height - 15) return null;
                      const color =
                        c.status === "CUSTOMS_HOLD" ? "#ef4444" :
                        c.status === "CLEARED" ? "#22c55e" :
                        c.type === "REEFER" ? "#06b6d4" :
                        c.type === "HAZMAT" ? "#f97316" : "#3b82f6";
                      return (
                        <rect
                          key={c.id}
                          x={dotX}
                          y={dotY}
                          width={14}
                          height={8}
                          fill={color}
                          rx="1"
                          opacity={0.8}
                          className="cursor-pointer hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedContainer(c);
                          }}
                        />
                      );
                    })}
                </svg>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-4">
            {/* Block Stats */}
            <div className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-700/50">
                <h3 className="text-white font-semibold">Block Summary</h3>
              </div>
              <div className="p-4 space-y-3">
                {mockYardBlocks.map((block) => {
                  const pct = Math.round((block.occupied / block.capacity) * 100);
                  const colors = blockColors[block.type];
                  return (
                    <div
                      key={block.id}
                      onClick={() => setSelectedBlock(selectedBlock === block.id ? null : block.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${colors.bg} ${colors.border} ${
                        selectedBlock === block.id ? "ring-2 ring-amber-500" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${colors.label}`}>Block {block.id}</span>
                        <span className="text-xs text-slate-400">{block.type}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                        <span>{block.occupied} / {block.capacity} TEU</span>
                        <span className={`font-bold ${pct > 80 ? "text-red-400" : pct > 60 ? "text-amber-400" : "text-emerald-400"}`}>
                          {pct}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${pct > 80 ? "bg-red-500" : pct > 60 ? "bg-amber-500" : "bg-emerald-500"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Block Containers */}
            {selectedBlock && selectedBlockData && (
              <div className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
                  <h3 className="text-white font-semibold">Block {selectedBlock} Containers</h3>
                  <button onClick={() => setSelectedBlock(null)} className="text-slate-400 hover:text-white">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                  {blockContainers.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-4">No containers in this block</p>
                  ) : (
                    blockContainers.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedContainer(c)}
                        className="p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-all"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-blue-300 text-xs">{c.containerNo}</span>
                          {c.type === "REEFER" && <Thermometer className="w-3.5 h-3.5 text-cyan-400" />}
                          {c.isHazmat && <Skull className="w-3.5 h-3.5 text-red-400" />}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-xs">{c.yardLocation}</span>
                          {getContainerStatusBadge(c.status)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Container Detail Modal */}
        {selectedContainer && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-5 border-b border-slate-700 flex items-center justify-between">
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
              <div className="p-6 grid grid-cols-2 gap-4">
                {[
                  ["Size", selectedContainer.size],
                  ["Type", selectedContainer.type],
                  ["Status", selectedContainer.status],
                  ["Location", selectedContainer.yardLocation || "—"],
                  ["Vessel", selectedContainer.vesselName],
                  ["Voyage", selectedContainer.voyageNo],
                  ["Shipper", selectedContainer.shipper],
                  ["Consignee", selectedContainer.consignee],
                  ["Commodity", selectedContainer.commodity],
                  ["Port of Loading", selectedContainer.portOfLoading],
                  ["Arrival Date", selectedContainer.arrivalDate],
                  ["Days in Yard", `${selectedContainer.daysInYard} days`],
                  ["Gross Weight", `${selectedContainer.grossWeight.toLocaleString()} kg`],
                  ["Customs Status", selectedContainer.customsStatus],
                  ["BE No", selectedContainer.beNo || "—"],
                  ["IGM No", selectedContainer.igmNo || "—"],
                ].map(([label, value]) => (
                  <div key={label} className="bg-slate-800 rounded-lg p-3">
                    <div className="text-xs text-slate-500 mb-0.5">{label}</div>
                    <div className="text-sm text-slate-200 font-medium">{value}</div>
                  </div>
                ))}
                {selectedContainer.type === "REEFER" && (
                  <div className="bg-cyan-900/30 border border-cyan-700/50 rounded-lg p-3 col-span-2">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-cyan-400" />
                      <span className="text-cyan-300 text-sm font-medium">
                        Temperature: {selectedContainer.temperature}°C
                      </span>
                    </div>
                  </div>
                )}
                {selectedContainer.isHazmat && (
                  <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 col-span-2">
                    <div className="flex items-center gap-2">
                      <Skull className="w-4 h-4 text-red-400" />
                      <span className="text-red-300 text-sm font-medium">
                        HAZMAT — IMO Class: {selectedContainer.imoClass} | UN No: {selectedContainer.unNo}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
