"use client";

import { Search, RefreshCw, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }) + " IST"
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-700/50 flex items-center px-6 gap-4 sticky top-0 z-40">
      <div className="flex-1">
        <h1 className="text-white font-semibold text-base leading-tight">{title}</h1>
        {subtitle && <p className="text-slate-400 text-xs">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search container, BL, truck..."
            className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg pl-9 pr-4 py-1.5 w-64 focus:outline-none focus:border-blue-500 placeholder-slate-500"
          />
        </div>

        {/* Time */}
        <div className="flex items-center gap-1.5 text-slate-400 text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-mono">{currentTime}</span>
        </div>

        {/* Refresh */}
        <button className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
