import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayoutGuard,
});

function AdminLayoutGuard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[70vh]">Loading...</div>;
  }

  if (!user || (user.role !== "super_admin" && user.role !== "assistant_admin")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <div className="h-16 w-16 bg-rose-500/10 text-rose-600 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-black text-brand-navy">Access Denied</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          Staff authentication is required to access the admin CRM. Please log in as an administrator to proceed.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/admin/login">
            <Button className="bg-primary hover:bg-brand-navy">Go to Admin Login</Button>
          </Link>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
