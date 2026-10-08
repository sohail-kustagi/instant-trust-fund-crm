import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardCharts from "@/components/dashboard-charts";
import { DEMO_CHARTS_DATA } from "@/lib/demo-data";
import {
  TrendingUp,
  Award,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  DollarSign,
  Percent,
} from "lucide-react";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "Analytics & Executive Intelligence — IFY CRM" }] }),
  component: AdminAnalytics,
});

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "primary",
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: any;
  trend: string;
  color?: string;
}) {
  const isPositive = trend.startsWith("+");
  return (
    <Card className="p-3.5 sm:p-5 border shadow-sm bg-card">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
          <h3 className="mt-1.5 sm:mt-2 text-lg sm:text-2xl font-black text-brand-navy">{value}</h3>
        </div>
        <div className="rounded-xl p-2 sm:p-2.5 bg-primary/10 text-primary">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>
      <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2.5 sm:pt-3 border-t border-slate-100 text-[11px] sm:text-xs">
        <span
          className={`font-bold flex items-center ${
            isPositive ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          <ArrowUpRight className="h-3.5 w-3.5 inline mr-0.5" />
          {trend}
        </span>
        <span className="text-muted-foreground truncate">{subtitle}</span>
      </div>
    </Card>
  );
}

function AdminAnalytics() {
  const { data } = useQuery({
    queryKey: ["crm-analytics"],
    queryFn: () => fetchAPI("/crm/dashboard"),
    initialData: DEMO_CHARTS_DATA,
  });

  const chartData = data || DEMO_CHARTS_DATA;

  const partnerPerformance = [
    { name: "State Bank of India (SBI)", loans: 142, volume: "₹6.8 Cr", approvalRate: "96.4%" },
    { name: "HDFC Bank", loans: 118, volume: "₹4.5 Cr", approvalRate: "94.2%" },
    { name: "ICICI Bank", loans: 88, volume: "₹3.2 Cr", approvalRate: "91.8%" },
    { name: "Canara Bank", loans: 54, volume: "₹1.9 Cr", approvalRate: "93.0%" },
    { name: "Tata Capital", loans: 34, volume: "₹1.4 Cr", approvalRate: "89.5%" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-brand-navy">Executive Intelligence</h1>
            <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 font-semibold text-xs">
              Live BI Feed
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Real-time disbursal tracking, underwriting conversion, and bank partner throughput.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
          <Clock className="h-4 w-4 text-primary" />
          <span>Trailing 180 Days Reporting</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <MetricCard
          title="Total Capital Disbursed"
          value="₹17.80 Crores"
          subtitle="vs last fiscal cycle"
          icon={DollarSign}
          trend="+24.8%"
        />
        <MetricCard
          title="Applications Processed"
          value="436 Inquiries"
          subtitle="94.2% approval rate"
          icon={TrendingUp}
          trend="+18.5%"
        />
        <MetricCard
          title="Avg Turnaround Time"
          value="2.8 Days"
          subtitle="Sanction to disbursement"
          icon={Clock}
          trend="-35.0%"
        />
        <MetricCard
          title="Active Partner Banks"
          value="24 Financial Inst."
          subtitle="PSU, Private & NBFCs"
          icon={Building2}
          trend="+4 New"
        />
      </div>

      {/* Interactive Charts */}
      <div className="mb-8">
        <DashboardCharts
          monthly={chartData.monthly}
          smsChart={chartData.smsChart}
          loanDist={chartData.loanDist}
          insDist={chartData.insDist}
        />
      </div>

      {/* Banking Partner Throughput */}
      <Card className="p-6 border shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Banking Partner Conversion Matrix
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Disbursement volume and approval velocity by partner institution.
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            FY 2026-27 Active
          </Badge>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold border-b">
              <tr>
                <th className="px-4 py-3">Lending Institution</th>
                <th className="px-4 py-3">Applications Sanctioned</th>
                <th className="px-4 py-3">Total Volume</th>
                <th className="px-4 py-3">Approval Velocity</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-600">
              {partnerPerformance.map((partner, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-semibold text-brand-navy">{partner.name}</td>
                  <td className="px-4 py-3">{partner.loans} Loans</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{partner.volume}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <Percent className="h-3 w-3" />
                      {partner.approvalRate}
                    </span>
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
