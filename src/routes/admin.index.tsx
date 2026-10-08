import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Landmark,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { DEMO_APPLICATIONS } from "@/lib/demo-data";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — IFY CRM" }] }),
  component: AdminDashboard,
});

function StatCard({ title, value, Icon, tone = "primary" }: any) {
  const toneCls =
    tone === "accent"
      ? "bg-amber-500/10 text-amber-600"
      : tone === "warn"
        ? "bg-rose-500/10 text-rose-600"
        : "bg-primary/10 text-primary";
  return (
    <Card className="p-4 sm:p-5 border shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </div>
          <div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-black">{value}</div>
        </div>
        <div className={`rounded-xl p-2 sm:p-2.5 ${toneCls}`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>
    </Card>
  );
}

function AdminDashboard() {
  const { user } = useAuth();

  const { data: appData, isLoading } = useQuery({
    queryKey: ["all-applications"],
    queryFn: () => fetchAPI("/applications/"),
    initialData: { applications: DEMO_APPLICATIONS },
  });

  if (user?.role === "assistant_admin") {
    return <Navigate to="/admin/tasks" replace />;
  }

  const applications =
    appData?.applications && appData.applications.length > 0
      ? appData.applications
      : DEMO_APPLICATIONS;
  
  const totalLoans = applications.filter((c: any) => c.productKind === "loan").length;
  const totalIns = applications.filter((c: any) => c.productKind === "insurance").length;
  const pending = applications.filter((c: any) => c.status === "Pending").length;
  const approved = applications.filter((c: any) => c.status === "Approved").length;
  const rejected = applications.filter((c: any) => c.status === "Rejected").length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black md:text-4xl text-brand-navy">Admin Dashboard</h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Real-time overview of the financial CRM.
          </p>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">Production Mode</Badge>
      </div>

      <div className="mt-6 sm:mt-8 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <StatCard title="Total Loans" value={totalLoans.toString()} Icon={Landmark} />
        <StatCard title="Insurance Policies" value={totalIns.toString()} Icon={ShieldCheck} />
        <StatCard title="Total Applications" value={applications.length.toString()} Icon={Users} />
        <StatCard title="Pending Review" value={pending.toString()} Icon={Clock} tone="accent" />
        <StatCard title="Approved Applications" value={approved.toString()} Icon={CheckCircle2} />
        <StatCard title="Rejected Applications" value={rejected.toString()} Icon={XCircle} tone="warn" />
      </div>

      <Card className="mt-6 sm:mt-8 p-4 sm:p-6 border shadow-sm">
        <h2 className="text-base sm:text-lg font-bold text-brand-navy border-b pb-3 mb-4">Recent Applications</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold border-b">
              <tr>
                <th className="px-4 py-3">Applicant Name</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-600">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground border-dashed border-2 m-4 rounded-xl">
                    The database is currently empty. No records to display.
                  </td>
                </tr>
              ) : (
                applications.slice(0, 10).map((app: any) => (
                  <tr key={app._id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-brand-navy">{app.fullName}</td>
                    <td className="px-4 py-3 capitalize">{app.productKind}</td>
                    <td className="px-4 py-3 font-medium">{app.productType}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{app.status}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
