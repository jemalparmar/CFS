"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading] = useState(false);
  const router = useRouter();

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Demo login - in production, this would call an API
    if (email && password) {
      const userData: User = {
        id: 1,
        name: email.split("@")[0],
        email: email,
        role: email.includes("admin") ? "admin" : "operator"
      };
      localStorage.setItem("cfs_user", JSON.stringify(userData));
      setUser(userData);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("cfs_user");
    setUser(null);
    router.push("/auth/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper to check if user is logged in (for use in components)
export function useUser() {
  const { user } = useAuth();
  return user;
}
