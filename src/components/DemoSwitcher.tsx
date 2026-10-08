import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { ShieldCheck, User, Users, Eye, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

export function DemoSwitcher() {
  const { user, loginAsDemo, logout } = useAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const [minimized, setMinimized] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  const currentRole = user?.role || "guest";
  const currentPath = routerState.location.pathname;

  const handleSwitch = async (role: "super_admin" | "assistant_admin" | "customer" | "guest") => {
    if (role === "guest") {
      await logout();
      if (currentPath.startsWith("/admin") || currentPath.startsWith("/dashboard") || currentPath.startsWith("/profile")) {
        navigate({ to: "/" });
      }
    } else if (role === "super_admin") {
      loginAsDemo("super_admin");
      navigate({ to: "/admin" });
    } else if (role === "assistant_admin") {
      loginAsDemo("assistant_admin");
      navigate({ to: "/admin/tasks" });
    } else if (role === "customer") {
      loginAsDemo("customer");
      navigate({ to: "/dashboard" });
    }
  };

  const getRoleLabel = () => {
    if (currentRole === "super_admin") return "Admin CRM";
    if (currentRole === "assistant_admin") return "Assistant";
    if (currentRole === "customer") return "Customer";
    return "Guest";
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 max-w-[calc(100vw-1.5rem)]">
      <div className="bg-brand-navy/95 backdrop-blur-md text-white border border-white/20 rounded-2xl shadow-2xl p-2.5 transition-all">
        {minimized ? (
          <button
            onClick={() => setMinimized(false)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:text-white transition"
            title="Expand Demo Showcase Switcher"
          >
            <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
            <span className="font-bold">Demo: <span className="text-white capitalize">{getRoleLabel()}</span></span>
            <ChevronUp className="h-3.5 w-3.5 ml-1" />
          </button>
        ) : (
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/10 px-1 mb-2 gap-3">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-amber-400 tracking-wide uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Demo Showcase Switcher</span>
              </div>
              <button
                onClick={() => setMinimized(true)}
                className="text-slate-400 hover:text-white p-1 rounded transition"
                title="Minimize Switcher"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 text-xs">
              <button
                onClick={() => handleSwitch("guest")}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition flex items-center justify-center sm:justify-start gap-1.5 ${
                  currentRole === "guest"
                    ? "bg-white/20 text-white font-bold ring-1 ring-white/40 shadow-sm"
                    : "text-slate-300 hover:bg-white/10"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Guest</span>
              </button>

              <button
                onClick={() => handleSwitch("customer")}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition flex items-center justify-center sm:justify-start gap-1.5 ${
                  currentRole === "customer"
                    ? "bg-emerald-500 text-white font-bold shadow-sm"
                    : "text-slate-300 hover:bg-white/10"
                }`}
              >
                <User className="h-3.5 w-3.5 text-emerald-300" />
                <span>Customer</span>
              </button>

              <button
                onClick={() => handleSwitch("super_admin")}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition flex items-center justify-center sm:justify-start gap-1.5 ${
                  currentRole === "super_admin"
                    ? "bg-primary text-white font-bold shadow-sm ring-1 ring-white/30"
                    : "text-slate-300 hover:bg-white/10"
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5 text-blue-300" />
                <span>Admin CRM</span>
              </button>

              <button
                onClick={() => handleSwitch("assistant_admin")}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition flex items-center justify-center sm:justify-start gap-1.5 ${
                  currentRole === "assistant_admin"
                    ? "bg-indigo-600 text-white font-bold shadow-sm ring-1 ring-white/30"
                    : "text-slate-300 hover:bg-white/10"
                }`}
              >
                <Users className="h-3.5 w-3.5 text-indigo-300" />
                <span>Assistant</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
