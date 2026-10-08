import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { fetchAPI } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Portal — IFY CRM" }] }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, loginAsDemo } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await fetchAPI("/auth/login", {
        method: "POST",
        body: JSON.stringify({ loginId: email, password })
      });
      
      if (data.user.role !== "super_admin") {
        await fetchAPI("/auth/logout", { method: "POST" });
        throw new Error("Unauthorized: Access restricted to Super Admins only.");
      }

      login(data.user);
      toast.success("Admin access granted.");
      navigate({ to: "/admin" });
    } catch (error: any) {
      toast.error(error.message || "Failed to login. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-8 sm:py-16 flex flex-col items-center bg-brand-surface min-h-screen">
      <div className="text-center w-full mb-6 sm:mb-8 flex flex-col items-center">
        <div className="bg-primary/10 p-3.5 sm:p-4 rounded-full mb-4">
          <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-black text-brand-navy">Super Admin Portal</h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Secure access for system administrators
        </p>
      </div>

      <Card className="p-5 sm:p-8 w-full border bg-card shadow-2xl rounded-xl sm:rounded-2xl">
        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-brand-navy">Admin Email</label>
            <input 
              type="email" 
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              placeholder="admin@instantfunds.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-brand-navy">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-brand-navy"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-brand-navy hover:bg-brand-navy/90 h-11 text-base font-medium transition-all"
            disabled={isLoading}
          >
            {isLoading ? "Authenticating..." : "Login to Admin"}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground font-semibold">Client Demo Access</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              loginAsDemo("super_admin");
              toast.success("Welcome, Syed Abdul Khader (Super Admin Demo)");
              navigate({ to: "/admin" });
            }}
            className="w-full border-primary/30 text-primary hover:bg-primary/10 h-auto min-h-[44px] py-2 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 text-center"
          >
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Quick Demo: 1-Click Login as Super Admin</span>
          </Button>
        </form>
      </Card>
    </div>
  );
}
