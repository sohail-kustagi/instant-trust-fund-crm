import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { fetchAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, AlertCircle } from "lucide-react";
import { DEMO_APPLICATIONS } from "@/lib/demo-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "My Dashboard — IFY CRM" }] }),
  component: DashboardGuard,
});

function DashboardGuard() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="flex justify-center p-12">Loading secure session...</div>;
  
  if (!user || user.role !== "customer") {
    // Basic redirect if not customer
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-xl font-bold text-rose-600">Access Restricted</h2>
        <p>You must be logged in as a customer to view this page.</p>
      </div>
    );
  }

  return <CustomerDashboard />;
}

function CustomerDashboard() {
  const { user } = useAuth();

  const myDemoApps = DEMO_APPLICATIONS.filter(
    (a) => a.fullName.includes("Sharma") || a._id === "APP-2026-001" || a._id === "APP-2026-004",
  );

  const { data, isLoading } = useQuery({
    queryKey: ["my-applications"],
    queryFn: () => fetchAPI("/applications/"),
    initialData: { applications: myDemoApps },
  });

  const apps = data?.applications && data.applications.length > 0 ? data.applications : myDemoApps;

  const activities = [
    { title: "SBI Home Loan Sanction Letter Issued", date: "Oct 02, 2026", status: "Approved" },
    { title: "Aadhaar e-KYC Verification Completed", date: "Sep 30, 2026", status: "Verified" },
    { title: "KGIS Cadastral Survey Record Audited", date: "Sep 28, 2026", status: "Verified" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-brand-navy">Welcome back, {user?.fullName}</h1>
        <p className="text-muted-foreground mt-1 text-xs sm:text-sm">Track your active applications and required documents here.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 p-4 sm:p-6 border shadow-sm">
          <h2 className="text-base sm:text-lg font-bold text-brand-navy mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> My Applications
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {apps.map((app: any) => (
              <div key={app._id} className="p-3.5 sm:p-4 border rounded-lg flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 bg-white hover:border-primary transition">
                <div className="min-w-0">
                  <h4 className="font-bold text-brand-navy capitalize text-sm">{app.productType}</h4>
                  <p className="text-xs text-muted-foreground mt-1">Ref: {app._id} • {app.bankPartner || "Banking Partner"}</p>
                  <p className="text-xs font-semibold text-emerald-600 mt-1">{app.amount || "₹45,00,000"} Sanctioned</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 self-start sm:self-auto shrink-0">{app.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 sm:p-6 border shadow-sm">
          <h2 className="text-base sm:text-lg font-bold text-brand-navy mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" /> Recent Activity
          </h2>
          <div className="space-y-2.5 sm:space-y-3">
            {activities.map((act, i) => (
              <div key={i} className="p-2.5 sm:p-3 border rounded-lg bg-slate-50 text-xs">
                <p className="font-bold text-brand-navy">{act.title}</p>
                <div className="flex items-center justify-between mt-1.5 text-muted-foreground">
                  <span>{act.date}</span>
                  <Badge variant="outline" className="text-[10px] py-0">{act.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
