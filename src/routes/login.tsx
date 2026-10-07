import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/lib/auth-context";
import { fetchAPI } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "User Login — IFY CRM" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, loginAsDemo } = useAuth();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId || !password) {
      toast.error("Please enter your email or mobile number and password");
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchAPI("/auth/login", {
        method: "POST",
        body: JSON.stringify({ loginId, password }),
      });

      login(data.user);
      toast.success(`Welcome back, ${data.user.fullName}`);
      navigate({ to: "/dashboard" });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to login. Check your credentials.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const data = await fetchAPI("/auth/google", {
        method: "POST",
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      login(data.user);
      toast.success(`Welcome, ${data.user.fullName}`);
      navigate({ to: "/dashboard" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Google login failed.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-16 flex flex-col items-center">
      <div className="text-center w-full mb-8">
        <h1 className="text-3xl font-black text-brand-navy">Customer Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to access your dashboard and applications.
        </p>
      </div>

      <Card className="p-8 w-full border bg-card shadow-lg">
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-brand-navy">Email or Mobile Number</label>
            <input
              type="text"
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              placeholder="name@example.com or 9876543210"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-brand-navy">Password</label>
              <button type="button" className="text-xs text-primary hover:underline">
                Forgot Password?
              </button>
            </div>
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

          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="mr-2 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="remember" className="text-sm text-muted-foreground">
              Remember me for 30 days
            </label>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-brand-navy h-11 text-base font-medium transition-all"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-muted"></div>
            <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm">or continue with</span>
            <div className="flex-grow border-t border-muted"></div>
          </div>

          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                toast.error("Google login failed");
              }}
              useOneTap
              theme="outline"
              size="large"
              shape="rectangular"
              width="100%"
            />
          </div>

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
              loginAsDemo("customer");
              toast.success("Welcome, Rajesh S. Sharma (Customer Demo)");
              navigate({ to: "/dashboard" });
            }}
            className="w-full border-emerald-500/40 text-emerald-700 hover:bg-emerald-50 h-11 font-semibold flex items-center justify-center gap-2"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Quick Demo: 1-Click Login as Customer
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </Card>
    </div>
  );
}
