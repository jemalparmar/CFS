"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Lock, User, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Demo login - in production, this would validate against the database
    if (email === "admin@cfs-tos.com" && password === "admin123") {
      // Store session in localStorage
      localStorage.setItem("cfs_user", JSON.stringify({
        id: 1,
        name: "Admin User",
        email: email,
        role: "admin"
      }));
      router.push("/");
    } else if (email && password) {
      // Allow any login for demo purposes
      localStorage.setItem("cfs_user", JSON.stringify({
        id: 1,
        name: email.split("@")[0],
        email: email,
        role: "operator"
      }));
      router.push("/");
    } else {
      setError("Please enter valid credentials");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-2xl mb-4">
            <Container className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">CFS Terminal OS</h1>
          <p className="text-slate-400 mt-2">Container Freight Station Management</p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Sign In</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-slate-400 text-sm mb-2">Email Address</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@cfs-tos.com"
                  className="w-full bg-slate-800 border border-slate-700 text-slate-300 rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500 placeholder-slate-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-slate-800 border border-slate-700 text-slate-300 rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500 placeholder-slate-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-400">
                <input type="checkbox" className="rounded bg-slate-800 border-slate-700" />
                Remember me
              </label>
              <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <p className="text-center text-slate-500 text-sm">
              Demo credentials: <span className="text-slate-400">admin@cfs-tos.com / admin123</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-sm mt-8">
          © 2024 CFS Terminal Operating System. All rights reserved.
        </p>
      </div>
    </div>
  );
}
