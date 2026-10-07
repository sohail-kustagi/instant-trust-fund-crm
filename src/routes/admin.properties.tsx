import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Shield, CheckCircle2, Clock } from "lucide-react";
import PropertyMap from "@/components/PropertyMap";
import { DEMO_PROPERTIES } from "@/lib/demo-data";

export const Route = createFileRoute("/admin/properties")({
  head: () => ({ meta: [{ title: "Property Verification CRM — IFY CRM" }] }),
  component: AdminProperties,
});

function AdminProperties() {
  const { data, isLoading } = useQuery({
    queryKey: ["property-requests"],
    queryFn: () => fetchAPI("/properties/"),
    initialData: { requests: DEMO_PROPERTIES },
  });

  const requests = data?.requests || data?.properties || DEMO_PROPERTIES;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-brand-navy">Property Verification GIS Map</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Geospatial land survey verification and land record audits. Owner details are restricted to authorized admins.
          </p>
        </div>
        <Badge className="bg-primary/10 text-primary px-3 py-1 text-xs">
          {requests.length} Verification Tasks
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Interactive Property Map */}
        <Card className="lg:col-span-2 border shadow-sm rounded-xl overflow-hidden min-h-[350px] relative">
          <PropertyMap properties={requests} />
        </Card>

        <Card className="p-6 border shadow-sm">
          <h3 className="text-base font-bold text-brand-navy border-b pb-3 mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" /> Security & Privacy Notice
          </h3>
          <ul className="text-xs space-y-3 text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Owner names, addresses, and phone numbers are encrypted and hidden from public views.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Only authorized Super Admins and Assistant Admins can view owner verification details.</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* Property Requests Table */}
      <Card className="border shadow-sm overflow-hidden">
        <div className="p-5 border-b bg-slate-50 font-bold text-brand-navy">
          Land Survey & Verification Requests
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100/70 text-xs uppercase text-slate-500 font-bold border-b">
              <tr>
                <th className="px-5 py-3.5">Property ID</th>
                <th className="px-5 py-3.5">Survey Number</th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Owner Name (Restricted)</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-600">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground animate-pulse">
                    Loading property verification records...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                    No property requests registered yet.
                  </td>
                </tr>
              ) : (
                requests.map((r: any) => (
                  <tr key={r._id} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-brand-navy">
                      {r.propertyId || r._id}
                    </td>
                    <td className="px-5 py-3.5 font-bold">Survey #{r.surveyNumber}</td>
                    <td className="px-5 py-3.5 text-xs">
                      {r.village}, {r.taluk}, {r.district}
                    </td>
                    <td className="px-5 py-3.5 capitalize text-xs">{r.propertyType}</td>
                    <td className="px-5 py-3.5 font-medium text-xs text-slate-700">
                      {r.ownerName || "•••••••• (Authorized View Only)"}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge
                        className={
                          r.status === "Verified"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-amber-500/10 text-amber-600"
                        }
                      >
                        {r.status}
                      </Badge>
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
