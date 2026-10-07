import React, { createContext, useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";
import { DEMO_USERS } from "@/lib/demo-data";

export type Role = "super_admin" | "assistant_admin" | "customer";

export interface User {
  id: string;
  fullName: string;
  email?: string;
  mobile?: string;
  dob?: string;
  role: Role;
  permissions?: string[];
  cibilScore?: number;
  city?: string;
  state?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: User) => void;
  loginAsDemo: (role: Role) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getLocalDemoUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("ify_demo_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user = null, isLoading, refetch } = useQuery<User | null>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      // First check local demo session
      const demoUser = getLocalDemoUser();
      if (demoUser) {
        return demoUser;
      }

      try {
        const data = await fetchAPI("/auth/me");
        if (data?.user) return data.user as User;
        return null;
      } catch {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  const login = (data: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ify_demo_user", JSON.stringify(data));
    }
    queryClient.setQueryData(["auth", "me"], data);
  };

  const loginAsDemo = (role: Role) => {
    const demoUser = DEMO_USERS[role] as User;
    login(demoUser);
  };

  const logoutMutation = useMutation({
    mutationFn: () => fetchAPI("/auth/logout", { method: "POST" }),
    onSuccess: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("ify_demo_user");
      }
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.clear(); // Clear all query caches on logout for security
    },
  });

  const logout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ify_demo_user");
    }
    await logoutMutation.mutateAsync();
  };

  const checkAuth = async () => {
    await refetch();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginAsDemo,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
