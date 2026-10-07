import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEMO_REFERRALS } from "@/lib/demo-data";
import { toast } from "sonner";
import {
  Users,
  Award,
  DollarSign,
  Briefcase,
  UserPlus,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

export const Route = createFileRoute("/admin/referrals")({
  head: () => ({ meta: [{ title: "DSA & Channel Partner Network — IFY CRM" }] }),
  component: AdminReferrals,
});

function AdminReferrals() {
  const { data } = useQuery({
    queryKey: ["admin-referrals"],
    queryFn: () => fetchAPI("/referrals"),
    initialData: { referrals: DEMO_REFERRALS },
  });

  const referrals = data?.referrals || DEMO_REFERRALS;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-brand-navy">Channel Partner Network (DSA)</h1>
            <Badge className="bg-primary/10 text-primary font-semibold">52 Active Partners</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Direct Selling Agents, Chartered Accountants, and Real Estate broker referral tracking.
          </p>
        </div>

        <Button
          onClick={() => toast.info("Partner onboarding modal opened (Demo Mode)")}
          className="bg-primary hover:bg-brand-navy flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" /> Onboard Partner
        </Button>
      </div>

      {/* Network Metrics */}
      <div className="grid gap-4 sm:grid-cols-4 mb-8">
        <Card className="p-5 border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-muted-foreground">Total Sourced Volume</span>
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black mt-2 text-brand-navy">₹8.65 Crores</div>
          <span className="text-xs text-emerald-600 font-bold mt-1 inline-block">+22.4% MoM</span>
        </Card>

        <Card className="p-5 border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-muted-foreground">Total Partner Leads</span>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-black mt-2 text-brand-navy">133 Applicants</div>
          <span className="text-xs text-muted-foreground mt-1 inline-block">78.5% conversion</span>
        </Card>

        <Card className="p-5 border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-muted-foreground">Commission Paid</span>
            <Award className="h-5 w-5 text-amber-600" />
          </div>
          <div className="text-2xl font-black mt-2 text-brand-navy">₹5,71,000</div>
          <span className="text-xs text-emerald-600 font-bold mt-1 inline-block">All payouts settled</span>
        </Card>

        <Card className="p-5 border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-muted-foreground">Top Tier Partner</span>
            <ShieldCheck className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-lg font-black mt-2 text-brand-navy truncate">S. Venkatesh (CA)</div>
          <span className="text-xs text-muted-foreground mt-1 inline-block">₹4.1 Cr Sourced</span>
        </Card>
      </div>

      {/* Partners Table */}
      <Card className="p-6 border shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 className="text-lg font-bold text-brand-navy">Registered Channel Partners</h2>
          <Badge variant="outline" className="text-xs">
            Commission Schedule FY26
          </Badge>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold border-b">
              <tr>
                <th className="px-4 py-3">Partner Name</th>
                <th className="px-4 py-3">Firm / Organization</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Leads Sourced</th>
                <th className="px-4 py-3">Sanctioned Volume</th>
                <th className="px-4 py-3">Commission Rate</th>
                <th className="px-4 py-3">Total Payout</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-600">
              {referrals.map((partner: any) => (
                <tr key={partner.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-semibold text-brand-navy">{partner.agentName}</td>
                  <td className="px-4 py-3 font-medium">{partner.firm}</td>
                  <td className="px-4 py-3">{partner.city}</td>
                  <td className="px-4 py-3">{partner.leadsCount}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{partner.sanctionedAmount}</td>
                  <td className="px-4 py-3 text-slate-700">{partner.commissionRate}</td>
                  <td className="px-4 py-3 font-bold text-emerald-600">{partner.payoutEarned}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        partner.status.includes("Platinum")
                          ? "border-purple-300 text-purple-700 bg-purple-50"
                          : "border-blue-300 text-blue-700 bg-blue-50"
                      }`}
                    >
                      {partner.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
