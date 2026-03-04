"use client";

import { TopBar } from "@/components/layout/TopBar";
import {
  mockDashboardStats,
  containerStatusData,
  weeklyTruckData,
  yardOccupancyData,
  mockContainers,
  mockGateEntries,
} from "@/lib/mock-data";
import {
  Container,
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Thermometer,
  Skull,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { getContainerStatusBadge } from "@/components/ui/Badge";

const statCards = [
  {
    label: "Total Containers",
    value: mockDashboardStats.totalContainers,
    icon: Container,
    color: "blue",
    change: "+12",
    changeType: "up",
  },
  {
    label: "In Yard",
    value: mockDashboardStats.containersInYard,
    icon: TrendingUp,
    color: "indigo",
    change: "+5",
    changeType: "up",
  },
  {
    label: "Cleared",
    value: mockDashboardStats.containersCleared,
    icon: CheckCircle,
    color: "emerald",
    change: "+8",
    changeType: "up",
  },
  {
    label: "On Hold",
    value: mockDashboardStats.containersOnHold,
    icon: AlertTriangle,
    color: "red",
    change: "-2",
    changeType: "down",
  },
  {
    label: "Trucks Today",
    value: mockDashboardStats.trucksToday,
    icon: Truck,
    color: "amber",
    change: "+4",
    changeType: "up",
  },
  {
    label: "Gate In",
    value: mockDashboardStats.gateInToday,
    icon: ArrowDownRight,
    color: "cyan",
    change: "+3",
    changeType: "up",
  },
  {
    label: "Gate Out",
    value: mockDashboardStats.gateOutToday,
    icon: ArrowUpRight,
    color: "violet",
    change: "+2",
    changeType: "up",
  },
  {
    label: "Pending Invoices",
    value: mockDashboardStats.pendingInvoices,
    icon: FileText,
    color: "orange",
    change: "-1",
    changeType: "down",
  },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-900/40 border-blue-700/40 text-blue-400",
  indigo: "bg-indigo-900/40 border-indigo-700/40 text-indigo-400",
  emerald: "bg-emerald-900/40 border-emerald-700/40 text-emerald-400",
  red: "bg-red-900/40 border-red-700/40 text-red-400",
  amber: "bg-amber-900/40 border-amber-700/40 text-amber-400",
  cyan: "bg-cyan-900/40 border-cyan-700/40 text-cyan-400",
  violet: "bg-violet-900/40 border-violet-700/40 text-violet-400",
  orange: "bg-orange-900/40 border-orange-700/40 text-orange-400",
};

export default function Dashboard() {
  const recentContainers = mockContainers.slice(0, 5);
  const recentGates = mockGateEntries.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-950">
      <TopBar title="Dashboard" subtitle="CFS Terminal Overview — NHAVA SHEVA" />

      <div className="p-6 space-y-6">
        {/* Alert Banner */}
        <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-amber-300 text-sm">
            <strong>12 containers</strong> have exceeded free time. Demurrage charges applicable.
            &nbsp;
            <span className="underline cursor-pointer">View Details →</span>
          </span>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            const colorClass = colorMap[card.color];
            return (
              <div
                key={card.label}
                className={`rounded-xl border p-4 ${colorClass} bg-opacity-30`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-slate-800/60`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      card.changeType === "up" ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {card.change} today
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">{card.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{card.label}</div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Truck Traffic */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Weekly Truck Traffic</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyTruckData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
                <Bar dataKey="gateIn" name="Gate In" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="gateOut" name="Gate Out" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Container Status Pie */}
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Container Status</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={containerStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {containerStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {containerStatusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-400">{item.name}</span>
                  </div>
                  <span className="text-slate-200 font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Yard Occupancy Chart */}
        <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Yard Occupancy Today</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Current:</span>
                <span className="text-blue-400 font-bold">{mockDashboardStats.yardOccupancy}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-400">Reefer:</span>
                <span className="text-cyan-400 font-medium">{mockDashboardStats.reeferCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Skull className="w-4 h-4 text-red-400" />
                <span className="text-slate-400">Hazmat:</span>
                <span className="text-red-400 font-medium">{mockDashboardStats.hazmatCount}</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={yardOccupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis domain={[60, 85]} tick={{ fill: "#94a3b8", fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                formatter={(v) => [`${v}%`, "Occupancy"]}
              />
              <Line type="monotone" dataKey="occupancy" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Containers */}
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
              <h3 className="text-white font-semibold">Recent Containers</h3>
              <a href="/containers" className="text-blue-400 text-xs hover:text-blue-300">View All →</a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left text-slate-400 font-medium px-5 py-3 text-xs">Container No</th>
                    <th className="text-left text-slate-400 font-medium px-3 py-3 text-xs">Size</th>
                    <th className="text-left text-slate-400 font-medium px-3 py-3 text-xs">Location</th>
                    <th className="text-left text-slate-400 font-medium px-3 py-3 text-xs">Status</th>
                    <th className="text-left text-slate-400 font-medium px-3 py-3 text-xs">Days</th>
                  </tr>
                </thead>
                <tbody>
                  {recentContainers.map((c) => (
                    <tr key={c.id} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3 font-mono text-blue-300 text-xs">{c.containerNo}</td>
                      <td className="px-3 py-3 text-slate-300 text-xs">{c.size}</td>
                      <td className="px-3 py-3 text-slate-400 text-xs font-mono">{c.yardLocation || "—"}</td>
                      <td className="px-3 py-3">{getContainerStatusBadge(c.status)}</td>
                      <td className="px-3 py-3">
                        <span className={`text-xs font-medium ${c.daysInYard > 7 ? "text-red-400" : "text-slate-300"}`}>
                          {c.daysInYard}d
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Gate Activity */}
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
              <h3 className="text-white font-semibold">Recent Gate Activity</h3>
              <a href="/gate" className="text-blue-400 text-xs hover:text-blue-300">View All →</a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left text-slate-400 font-medium px-5 py-3 text-xs">Truck No</th>
                    <th className="text-left text-slate-400 font-medium px-3 py-3 text-xs">Gate</th>
                    <th className="text-left text-slate-400 font-medium px-3 py-3 text-xs">Time</th>
                    <th className="text-left text-slate-400 font-medium px-3 py-3 text-xs">Status</th>
                    <th className="text-left text-slate-400 font-medium px-3 py-3 text-xs">QR</th>
                  </tr>
                </thead>
                <tbody>
                  {recentGates.map((g) => (
                    <tr key={g.id} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3 font-mono text-amber-300 text-xs">{g.truckNo}</td>
                      <td className="px-3 py-3 text-slate-300 text-xs">{g.gateNo}</td>
                      <td className="px-3 py-3 text-slate-400 text-xs">
                        {new Date(g.entryTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          g.status === "IN"
                            ? "bg-blue-900/60 text-blue-300"
                            : g.status === "OUT"
                            ? "bg-emerald-900/60 text-emerald-300"
                            : "bg-amber-900/60 text-amber-300"
                        }`}>
                          {g.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        {g.qrScanned ? (
                          <span className="text-emerald-400 text-xs">✓ Scanned</span>
                        ) : (
                          <span className="text-slate-500 text-xs">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-900/40 rounded-lg flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{mockDashboardStats.reeferCount}</div>
              <div className="text-xs text-slate-400">Reefer Containers</div>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-900/40 rounded-lg flex items-center justify-center">
              <Skull className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{mockDashboardStats.hazmatCount}</div>
              <div className="text-xs text-slate-400">Hazmat Containers</div>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-900/40 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{mockDashboardStats.overdueContainers}</div>
              <div className="text-xs text-slate-400">Overdue (Demurrage)</div>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-900/40 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{mockDashboardStats.yardOccupancy}%</div>
              <div className="text-xs text-slate-400">Yard Occupancy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
