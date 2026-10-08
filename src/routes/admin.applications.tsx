import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";
import { DEMO_APPLICATIONS } from "@/lib/demo-data";
import { toast } from "sonner";
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Building,
  User,
  Filter,
} from "lucide-react";

export const Route = createFileRoute("/admin/applications")({
  head: () => ({ meta: [{ title: "Applications Manager — IFY CRM" }] }),
  component: AdminApplications,
});

function AdminApplications() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [appsList, setAppsList] = useState(DEMO_APPLICATIONS);

  const { data } = useQuery({
    queryKey: ["all-applications-list"],
    queryFn: () => fetchAPI("/applications/"),
    initialData: { applications: DEMO_APPLICATIONS },
  });

  const allApps = appsList.length > 0 ? appsList : (data?.applications || DEMO_APPLICATIONS);

  const handleAction = (appId: string, newStatus: string) => {
    setAppsList((prev) =>
      prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a)),
    );
    toast.success(`Application ${appId} marked as ${newStatus}`);
  };

  const filtered = allApps.filter((app: any) => {
    const matchesFilter =
      filter === "All" ||
      (filter === "Pending" && app.status === "Pending") ||
      (filter === "Approved" && app.status === "Approved") ||
      (filter === "Loans" && app.productKind === "loan") ||
      (filter === "Insurance" && app.productKind === "insurance");

    const matchesSearch =
      app.fullName.toLowerCase().includes(search.toLowerCase()) ||
      app._id.toLowerCase().includes(search.toLowerCase()) ||
      app.productType.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-brand-navy">Applications Manager</h1>
            <Badge className="bg-primary/10 text-primary font-semibold text-xs">
              {allApps.length} Submissions
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Review, underwrite, and authorize retail loan & insurance applications.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applicant name or ref #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pb-3 border-b mb-6 overflow-x-auto no-scrollbar">
        {["All", "Pending", "Approved", "Loans", "Insurance"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              filter === tab
                ? "bg-brand-navy text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card className="p-8 sm:p-12 text-center border-dashed">
            <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">No applications match your filter</p>
          </Card>
        ) : (
          filtered.map((app: any) => (
            <Card
              key={app._id}
              className="p-4 sm:p-5 border bg-card shadow-sm hover:border-primary/50 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {app._id}
                    </span>
                    <h3 className="text-base font-bold text-brand-navy">{app.fullName}</h3>
                    <Badge
                      className={`text-[11px] ${
                        app.status === "Approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {app.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-slate-700 capitalize">
                      {app.productKind}: {app.productType}
                    </span>
                    <span>Amount: <strong className="text-brand-navy">{app.amount}</strong></span>
                    <span>Partner: <strong>{app.bankPartner}</strong></span>
                    <span>Assigned: {app.assignedTo}</span>
                  </div>

                  {app.stage && (
                    <div className="mt-2 text-xs text-primary font-medium flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      <span>Stage: {app.stage}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 w-full sm:w-auto justify-end">
                  {app.status !== "Approved" && (
                    <Button
                      size="sm"
                      onClick={() => handleAction(app._id, "Approved")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                    </Button>
                  )}
                  {app.status !== "Rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(app._id, "Rejected")}
                      className="border-rose-200 text-rose-600 hover:bg-rose-50 text-xs h-8"
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
