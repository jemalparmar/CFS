"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Container,
  FileText,
  QrCode,
  Truck,
  Scale,
  FileCheck,
  ChevronRight,
  Anchor,
  Bell,
  Settings,
  LogOut,
  ClipboardList,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Yard Map",
    href: "/yard-map",
    icon: Map,
  },
  {
    label: "Container Tracking",
    href: "/containers",
    icon: Container,
  },
  {
    label: "Gate Management",
    href: "/gate",
    icon: QrCode,
  },
  {
    label: "Truck Tokens",
    href: "/tokens",
    icon: Truck,
  },
  {
    label: "Weighbridge",
    href: "/weighbridge",
    icon: Scale,
  },
  {
    label: "TAX Invoice",
    href: "/invoices",
    icon: FileText,
  },
  {
    label: "ICEGATE / CBIC",
    href: "/icegate",
    icon: FileCheck,
  },
  {
    label: "Delivery Orders",
    href: "/delivery-orders",
    icon: ClipboardList,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-700/50 flex flex-col z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/50">
        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Anchor className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-white font-bold text-sm leading-tight">CFS Terminal</div>
          <div className="text-slate-400 text-xs">Operating System</div>
        </div>
      </div>

      {/* Station Info */}
      <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-800/50">
        <div className="text-xs text-slate-400">Station</div>
        <div className="text-sm text-slate-200 font-medium">NHAVA SHEVA CFS</div>
        <div className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block"></span>
          System Online
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <div className="text-xs text-slate-500 uppercase tracking-wider px-3 mb-2">Main Menu</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all group ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300"}`} size={18} />
              <span className="text-sm font-medium flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-slate-700/50 p-3 space-y-1">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 w-full transition-all">
          <Bell size={16} />
          <span className="text-sm">Notifications</span>
          <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
        </button>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 w-full transition-all">
          <Settings size={16} />
          <span className="text-sm">Settings</span>
        </button>
        <div className="border-t border-slate-700/50 pt-2 mt-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              OP
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-200 font-medium truncate">Operator 1</div>
              <div className="text-xs text-slate-500 truncate">Gate Supervisor</div>
            </div>
            <button className="text-slate-500 hover:text-slate-300">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
