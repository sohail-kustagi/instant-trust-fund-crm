import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ShieldCheck,
  Activity,
  Car,
  Heart,
  FileText,
  HelpCircle,
  TrendingUp,
  Search,
  CheckCircle,
  FileClock,
} from "lucide-react";

export const Route = createFileRoute("/policybazaar")({
  head: () => ({
    meta: [
      { title: "Policybazaar Services — Instant Trust Funds" },
      {
        name: "description",
        content: "Compare health, motor, life policies and process instant claim renewals.",
      },
    ],
  }),
  component: PolicyBazaarPage,
});

type TabType = "compare" | "health" | "motor" | "life" | "renew" | "claims";

export function PolicyBazaarPage() {
  const [activeTab, setActiveTab] = useState<TabType>("compare");

  // Health State
  const [healthAge, setHealthAge] = useState("30");
  const [healthCover, setHealthCover] = useState("10"); // in Lakhs
  const [healthQuote, setHealthQuote] = useState<{ provider: string; premium: number }[] | null>(
    null,
  );

  // Motor State
  const [vehicleNo, setVehicleNo] = useState("");
  const [motorQuote, setMotorQuote] = useState<{ idv: string; premium: number } | null>(null);

  // Life State
  const [lifeCover, setLifeCover] = useState("1"); // in Cr
  const [isSmoker, setIsSmoker] = useState(false);
  const [lifeQuote, setLifeQuote] = useState<number | null>(null);

  // Renew State
  const [renewPolicyNo, setRenewPolicyNo] = useState("");
  const [renewName, setRenewName] = useState("");

  // Claims State
  const [claimPolicyNo, setClaimPolicyNo] = useState("");
  const [claimReason, setClaimReason] = useState("");

  const handleHealthCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const ageVal = parseInt(healthAge) || 30;
    const coverVal = parseInt(healthCover) || 10;
    const base = ageVal * 250 + coverVal * 400;

    setHealthQuote([
      { provider: "Care Health Secure", premium: Math.round(base * 0.95) },
      { provider: "Star Health Assure", premium: Math.round(base * 1.05) },
      { provider: "Aditya Birla Active", premium: Math.round(base * 1.1) },
      { provider: "Niva Bupa ReAssure", premium: Math.round(base * 1.0) },
    ]);
    toast.success("Quotes loaded successfully!");
  };

  const handleMotorCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNo) return;
    const calculatedIdv = 450000;
    const calculatedPremium = 12500;
    setMotorQuote({ idv: `₹${calculatedIdv.toLocaleString()}`, premium: calculatedPremium });
    toast.success("Motor quotes fetched!");
  };

  const handleLifeCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const coverCr = parseFloat(lifeCover) || 1;
    let base = coverCr * 8500;
    if (isSmoker) base *= 1.6;
    setLifeQuote(Math.round(base));
    toast.success("Term insurance quote generated!");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-14">
      {/* Policybazaar Disclaimer Header */}
      <div className="mb-8 sm:mb-10 rounded-xl sm:rounded-2xl bg-brand-gradient text-white p-5 sm:p-8 shadow-elevated relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-6 translate-x-6">
          <ShieldCheck className="h-64 w-64" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <Badge className="bg-soft-pink text-white hover:bg-soft-pink/90 mb-3 px-3 py-1 font-bold text-xs">
            Policybazaar Premium Partner Channel
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white">
            Policy Comparison & Renewals
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-white/80 leading-relaxed">
            Compare plans, renew coverages, and request claims assistance instantly. Instant Trust
            Fund leverages secure comparison parameters to guide your insurance investments.
          </p>
          <div className="mt-4 rounded-lg bg-white/10 border border-white/20 p-3 text-[11px] text-white/90 leading-relaxed">
            ⚠️ **Official Partner Disclaimer**: Product comparisons, IDV appraisals, and quote
            structures are indicative and may change based on underwriting and carrier terms. Final
            policy issuance and claims are subject to the partner insurer's approval.
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex items-center gap-2 mb-8 border-b pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: "compare", label: "Compare Policies", icon: Search },
          { id: "health", label: "Health Insurance", icon: Heart },
          { id: "motor", label: "Motor Insurance", icon: Car },
          { id: "life", label: "Life Term Cover", icon: Activity },
          { id: "renew", label: "Buy / Renew", icon: FileClock },
          { id: "claims", label: "Claim Desk", icon: HelpCircle },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as TabType)}
              className={`shrink-0 flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === t.id
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-muted-foreground hover:bg-slate-100 hover:text-foreground border border-slate-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {activeTab === "compare" && (
            <Card className="p-6 border shadow-card">
              <h3 className="text-lg font-bold text-brand-navy border-b pb-3 mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" /> Integrated Insurance Matcher
              </h3>
              <p className="text-xs text-muted-foreground mb-6">
                Compare multi-provider health policies dynamically. Filter details below:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b bg-slate-50 text-slate-700">
                      <th className="p-3 font-semibold">Insurance Provider</th>
                      <th className="p-3 font-semibold">Base Cover</th>
                      <th className="p-3 font-semibold">Cashless Hospitals</th>
                      <th className="p-3 font-semibold">Co-Pay</th>
                      <th className="p-3 font-semibold">Est. Monthly Premium</th>
                      <th className="p-3 font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        provider: "Star Health Optima",
                        cover: "₹10 Lakhs",
                        cashless: "140+ in Karnataka",
                        copay: "No Co-pay",
                        price: "₹680",
                      },
                      {
                        provider: "Care Health Supreme",
                        cover: "₹10 Lakhs",
                        cashless: "190+ in Karnataka",
                        copay: "10% Co-pay",
                        price: "₹612",
                      },
                      {
                        provider: "Niva Bupa ReAssure",
                        cover: "₹10 Lakhs",
                        cashless: "155+ in Karnataka",
                        copay: "No Co-pay",
                        price: "₹720",
                      },
                      {
                        provider: "Aditya Birla Active",
                        cover: "₹10 Lakhs",
                        cashless: "120+ in Karnataka",
                        copay: "No Co-pay",
                        price: "₹790",
                      },
                    ].map((item, idx) => (
                      <tr key={idx} className="border-b last:border-0 hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-brand-navy">{item.provider}</td>
                        <td className="p-3">{item.cover}</td>
                        <td className="p-3">{item.cashless}</td>
                        <td className="p-3">{item.copay}</td>
                        <td className="p-3 font-bold text-primary">{item.price}</td>
                        <td className="p-3">
                          <Button
                            size="sm"
                            className="bg-secondary text-white hover:bg-brand-navy"
                            onClick={() => toast.success(`Callback requested for ${item.provider}`)}
                          >
                            Enquire
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeTab === "health" && (
            <Card className="p-6 border shadow-card">
              <h3 className="text-lg font-bold text-brand-navy border-b pb-3 mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" /> Health Insurance Quote Engine
              </h3>
              <form onSubmit={handleHealthCalculate} className="space-y-4 max-w-md">
                <div>
                  <Label htmlFor="healthAge">Age of Eldest Insured Member</Label>
                  <Input
                    id="healthAge"
                    type="number"
                    value={healthAge}
                    onChange={(e) => setHealthAge(e.target.value)}
                    min={18}
                    max={100}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="healthCover">Desired Cover Limit (in Lakhs)</Label>
                  <select
                    id="healthCover"
                    value={healthCover}
                    onChange={(e) => setHealthCover(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-xs"
                  >
                    <option value="5">₹5 Lakhs</option>
                    <option value="10">₹10 Lakhs</option>
                    <option value="15">₹15 Lakhs</option>
                    <option value="20">₹20 Lakhs</option>
                    <option value="50">₹50 Lakhs</option>
                  </select>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-brand-navy text-white">
                  Calculate Health Cover Premiums
                </Button>
              </form>

              {healthQuote && (
                <div className="mt-8 border-t pt-6 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-2">
                    Indicative Health Quotations
                  </h4>
                  {healthQuote.map((q, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-slate-50 border p-3 rounded-lg text-xs"
                    >
                      <div>
                        <span className="font-bold text-brand-navy block">{q.provider}</span>
                        <span className="text-[10px] text-muted-foreground">
                          Cashless hospitalization network included
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-primary block">
                          ₹{q.premium.toLocaleString()} / yr
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[10px] text-primary p-0 h-auto hover:underline"
                          onClick={() =>
                            toast.success(`Selected ${q.provider}. We will connect shortly.`)
                          }
                        >
                          Select Plan &rarr;
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {activeTab === "motor" && (
            <Card className="p-6 border shadow-card">
              <h3 className="text-lg font-bold text-brand-navy border-b pb-3 mb-4 flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" /> Motor Insurance Calculator
              </h3>
              <form onSubmit={handleMotorCalculate} className="space-y-4 max-w-md">
                <div>
                  <Label htmlFor="vehicleNo">
                    Vehicle Registration Number (e.g. KA-03-ME-1234)
                  </Label>
                  <Input
                    id="vehicleNo"
                    placeholder="KA-03-ME-1234"
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-brand-navy text-white">
                  Fetch Vehicle IDV & Quote
                </Button>
              </form>

              {motorQuote && (
                <div className="mt-8 border-t pt-6">
                  <div className="p-4 rounded-xl border bg-slate-50 flex flex-col md:flex-row justify-between md:items-center gap-4 text-xs">
                    <div>
                      <span className="font-bold text-brand-navy text-sm">
                        Insured Declared Value (IDV)
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Calculated based on standard depreciation schedule.
                      </p>
                      <span className="text-lg font-black text-brand-navy mt-1 block">
                        {motorQuote.idv}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-600 block">Est. Annual Premium</span>
                      <span className="text-lg font-black text-primary block">
                        ₹{motorQuote.premium.toLocaleString()}
                      </span>
                      <Button
                        size="sm"
                        className="mt-2 bg-secondary text-white hover:bg-brand-navy"
                        onClick={() => toast.success("Motor policy application submitted")}
                      >
                        Buy Policy Online
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )}

          {activeTab === "life" && (
            <Card className="p-6 border shadow-card">
              <h3 className="text-lg font-bold text-brand-navy border-b pb-3 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Term Life Insurance Calculator
              </h3>
              <form onSubmit={handleLifeCalculate} className="space-y-4 max-w-md">
                <div>
                  <Label htmlFor="lifeCover">Sum Assured</Label>
                  <select
                    id="lifeCover"
                    value={lifeCover}
                    onChange={(e) => setLifeCover(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-xs"
                  >
                    <option value="0.5">₹50 Lakhs</option>
                    <option value="1">₹1 Crore</option>
                    <option value="1.5">₹1.5 Crores</option>
                    <option value="2">₹2 Crores</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="isSmoker"
                    type="checkbox"
                    checked={isSmoker}
                    onChange={(e) => setIsSmoker(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="isSmoker" className="text-xs">
                    Have you consumed nicotine in the last 12 months?
                  </Label>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-brand-navy text-white">
                  Estimate Monthly Premium
                </Button>
              </form>

              {lifeQuote !== null && (
                <div className="mt-8 border-t pt-6 text-center bg-slate-50 p-6 rounded-xl border">
                  <span className="text-xs uppercase text-muted-foreground font-semibold block">
                    Estimated Term Premium
                  </span>
                  <div className="text-3xl font-black text-brand-navy mt-1">
                    ₹{lifeQuote.toLocaleString()} <span className="text-xs font-normal">/ yr</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2 max-w-sm mx-auto">
                    Term life cover provides financial protection for your dependents in the event
                    of an untimely death. Quote is inclusive of standard GST.
                  </p>
                  <Button
                    className="mt-4 bg-secondary text-white hover:bg-brand-navy"
                    onClick={() => toast.success("Advisory callback booked for Term Plan")}
                  >
                    Request Free Consultation
                  </Button>
                </div>
              )}
            </Card>
          )}

          {activeTab === "renew" && (
            <Card className="p-6 border shadow-card">
              <h3 className="text-lg font-bold text-brand-navy border-b pb-3 mb-4 flex items-center gap-2">
                <FileClock className="h-5 w-5 text-primary" /> Renew Existing Insurance Policy
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success(
                    `Policy ${renewPolicyNo} verified. Initiating secure payment flow...`,
                  );
                }}
                className="space-y-4 max-w-md"
              >
                <div>
                  <Label htmlFor="renewPolicyNo">Policy Number</Label>
                  <Input
                    id="renewPolicyNo"
                    placeholder="e.g. POL1102938"
                    value={renewPolicyNo}
                    onChange={(e) => setRenewPolicyNo(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="renewName">Full Name of Insured</Label>
                  <Input
                    id="renewName"
                    placeholder="e.g. Vikram Sharma"
                    value={renewName}
                    onChange={(e) => setRenewName(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-brand-navy text-white">
                  Retrieve & Renew Policy
                </Button>
              </form>
            </Card>
          )}

          {activeTab === "claims" && (
            <Card className="p-6 border shadow-card">
              <h3 className="text-lg font-bold text-brand-navy border-b pb-3 mb-4 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" /> Policybazaar Claim Assistance Desk
              </h3>
              <p className="text-xs text-muted-foreground mb-6">
                Need to process a cashless claim? Submit parameters to activate claim coordinators.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success(
                    `Claim request registered for policy ${claimPolicyNo}. An advisor will contact you within 15 minutes.`,
                  );
                }}
                className="space-y-4 max-w-md"
              >
                <div>
                  <Label htmlFor="claimPolicyNo">Policy Reference Code</Label>
                  <Input
                    id="claimPolicyNo"
                    placeholder="e.g. StarHealth-9088"
                    value={claimPolicyNo}
                    onChange={(e) => setClaimPolicyNo(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="claimReason">Reason for Claim Request</Label>
                  <textarea
                    id="claimReason"
                    rows={4}
                    placeholder="Briefly state reason (e.g. Emergency hospitalization at Apollo)"
                    value={claimReason}
                    onChange={(e) => setClaimReason(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-xs"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-brand-navy text-white">
                  Register Claim Support Ticket
                </Button>
              </form>
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 border bg-slate-50 shadow-card">
            <h4 className="text-sm font-bold text-brand-navy mb-3 flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" /> Instant Trust Fund Guarantee
            </h4>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold mt-0.5">✔</span>
                <span>
                  **Best Prices Guaranteed**: Compare across 20+ insurers and buy without markup.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold mt-0.5">✔</span>
                <span>
                  **Dedicated Claims Desk**: 24x7 support during medical or motor emergencies.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold mt-0.5">✔</span>
                <span>**Doorstep Documentation**: Zero physical office visits required.</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 border shadow-card bg-primary/5 border-primary/20">
            <h4 className="text-sm font-bold text-brand-navy mb-2 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-primary" /> Why Buy Term Cover?
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Term insurance secures your family's future at minimal costs. High cover limits
              starting from ₹1 Crore cost as low as ₹20 per day.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
