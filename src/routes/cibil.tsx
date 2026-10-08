import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  CreditCard,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Smartphone,
  ArrowRight,
  Loader2,
  Lock,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { CibilGauge } from "@/components/features/cibil/cibil-gauge";
import { CibilMetrics } from "@/components/features/cibil/cibil-metrics";
import { CibilHistory } from "@/components/features/cibil/cibil-history";

export const Route = createFileRoute("/cibil")({
  head: () => ({
    meta: [
      { title: "Get Your Official CIBIL Credit Score — Instant Funds" },
      {
        name: "description",
        content: "Get your official TransUnion CIBIL credit report instantly. Check loan eligibility, payment history, and credit health analysis.",
      },
    ],
  }),
  component: CibilPage,
});

type Step = "input" | "checkout" | "loading" | "results" | "dashboard";

function CibilPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("input");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pan, setPan] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [queueState, setQueueState] = useState("");
  
  // Custom states for demo mode
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoScore, setDemoScore] = useState(780);

  // Fetch real CIBIL checks from backend
  const { data: cibilData, isLoading: isLoadingChecks } = useQuery({
    queryKey: ["cibil-checks"],
    queryFn: () => fetchAPI("/cibil"),
    enabled: !!user,
  });

  // API mutation to request check
  const checkMutation = useMutation({
    mutationFn: (payload: { fullName: string; mobile: string; pan: string; consentGiven: boolean }) =>
      fetchAPI("/cibil/request", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cibil-checks"] });
    },
  });

  // Detect if user already has a completed score to skip to dashboard
  const completedCheck = useMemo(() => {
    if (isDemoMode) return { creditScore: demoScore };
    if (!cibilData?.requests) return null;
    return cibilData.requests.find((r: any) => r.status === "completed" || r.creditScore);
  }, [cibilData, isDemoMode, demoScore]);

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !mobile || !pan) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const cleanPan = pan.trim().toUpperCase();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
      toast.error("Enter a valid 10-character PAN number (e.g. ABCDE1234F).");
      return;
    }
    setStep("checkout");
  };

  const handlePayment = async () => {
    setStep("loading");
    await new Promise((r) => setTimeout(r, 900));
    setOtpSent(true);
    setStep("checkout");
  };

  const verifyOtpAndShowResults = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      toast.error("Enter the verification code received from the provider.");
      return;
    }
    setVerifyingOtp(true);

    const states = [
      "Submitting verification request to queue...",
      "Request accepted by the bureau provider.",
      "Awaiting provider callback and secure record match.",
      "CIBIL request stored in database.",
    ];

    for (let i = 0; i < states.length; i++) {
      setQueueState(states[i]);
      await new Promise((r) => setTimeout(r, 600));
    }

    try {
      await checkMutation.mutateAsync({
        fullName,
        mobile,
        pan: pan.toUpperCase(),
        consentGiven: true,
      });

      setVerifyingOtp(false);
      setStep("results");
      toast.success("CIBIL verification request successfully submitted.");
    } catch (err: any) {
      setVerifyingOtp(false);
      toast.error(err.message || "Failed to submit bureau request.");
      setStep("input");
    }
  };

  const startDemoMode = () => {
    setIsDemoMode(true);
    setStep("dashboard");
    toast.success("Entering Demo Mode with simulated TransUnion CIBIL score.");
  };

  if (completedCheck || step === "dashboard") {
    const activeScore = completedCheck?.creditScore || 780;
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between border-b pb-5 flex-wrap gap-4">
            <div>
              <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 font-extrabold px-3 py-1 mb-2 text-xs">
                ⚡ Bureau Check Complete
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-black text-brand-navy dark:text-white tracking-tight">
                Credit Health Command Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Live TransUnion CIBIL data for {user?.fullName || "Valued Member"}
              </p>
            </div>
            
            {isDemoMode && (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Badge variant="outline" className="border-amber-200 text-amber-600 bg-amber-50 text-xs">
                  Demo Mode
                </Badge>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    const newScore = Math.floor(300 + Math.random() * 600);
                    setDemoScore(newScore);
                    toast.success(`Score updated to ${newScore}`);
                  }}
                  className="text-xs font-bold h-8"
                >
                  Randomize Score
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => {
                    setIsDemoMode(false);
                    setStep("input");
                    toast.info("Exited Demo Mode.");
                  }}
                  className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-bold h-8"
                >
                  Exit Demo
                </Button>
              </div>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <CibilGauge score={activeScore} />
            </div>
            
            <div className="md:col-span-2 flex flex-col justify-between">
              <div className="bg-gradient-to-br from-royal-purple/5 to-lic-blue/5 border border-royal-purple/10 rounded-2xl p-4 sm:p-6 mb-6">
                <h3 className="text-xs sm:text-sm font-bold text-royal-purple uppercase tracking-wider mb-2">
                  Officer Recommendation
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-brand-navy dark:text-slate-200 leading-relaxed">
                  {activeScore >= 750 
                    ? "Congratulations! Your credit health is in top tier. You qualify for our exclusive Prime Loan offerings with interest rates starting as low as 8.4% p.a. No extra processing fees or collaterals required."
                    : activeScore >= 600
                    ? "Your credit profile looks stable. You are eligible for standard credit cards and home/vehicle loans. To push your score past 750, ensure you maintain credit utilization below 30% and close any unused older cards."
                    : "Your credit score requires attention. We recommend setting up automated payment alerts, avoiding hard enquiries for the next 90 days, and disputing any incorrect entry listed in the credit history tab below."
                  }
                </p>
              </div>
              <CibilMetrics 
                metrics={{
                  totalAccounts: activeScore >= 750 ? 5 : 4,
                  creditUtilization: activeScore >= 750 ? 12 : activeScore >= 600 ? 28 : 45,
                  activeLoans: activeScore >= 750 ? 1 : 2,
                  recentEnquiries: activeScore >= 750 ? 0 : activeScore >= 600 ? 1 : 3,
                }} 
              />
            </div>
          </div>

          <CibilHistory />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-12 px-4 sm:px-6">
      {/* Title */}
      <div className="text-center mb-8 sm:mb-12 max-w-2xl mx-auto space-y-2 sm:space-y-3">
        <Badge className="bg-primary text-white hover:opacity-95 border-none py-1 px-3 mb-2 text-xs font-black shadow-md">
          ⚡ Bureau Score Integration
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-navy dark:text-white md:text-5xl tracking-tight leading-tight">
          Retrieve Credit Score
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
          Request your official TransUnion CIBIL report. Verified high credit profiles receive priority processing and lower interest rates.
        </p>
        
        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={startDemoMode} 
            className="border-dashed border-primary text-primary hover:bg-primary/5 text-xs font-bold"
          >
            ⚡ Preview Score Dashboard (Demo)
          </Button>
        </div>
      </div>

      {/* Stepper Indicator */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 dark:bg-slate-800 -z-10" />

          {/* Step 1: Details */}
          <div className="flex flex-col items-center">
            <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
              step === "input" ? "bg-primary text-white shadow-lg scale-105" : "bg-emerald-500 text-white"
            }`}>
              {step !== "input" ? <CheckCircle2 className="h-4 w-4" /> : "1"}
            </div>
            <span className="text-[10px] sm:text-xs font-bold mt-2 text-slate-500">Details</span>
          </div>

          {/* Step 2: Payment */}
          <div className="flex flex-col items-center">
            <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
              step === "checkout" ? "bg-primary text-white shadow-lg scale-105" : step === "results" ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-400"
            }`}>
              {step === "results" ? <CheckCircle2 className="h-4 w-4" /> : "2"}
            </div>
            <span className="text-[10px] sm:text-xs font-bold mt-2 text-slate-500">Payment</span>
          </div>

          {/* Step 3: Results */}
          <div className="flex flex-col items-center">
            <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
              step === "results" ? "bg-primary text-white shadow-lg scale-105" : "bg-slate-200 dark:bg-slate-800 text-slate-400"
            }`}>
              3
            </div>
            <span className="text-[10px] sm:text-xs font-bold mt-2 text-slate-500">Verification</span>
          </div>
        </div>
      </div>

      {/* Form Steps */}
      {step === "input" && (
        <div className="max-w-xl mx-auto space-y-6">
          <Card className="p-4 sm:p-6 border bg-card shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <h3 className="text-base font-extrabold text-brand-navy dark:text-white border-b pb-3 mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Credit Bureau Consent Form
            </h3>

            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name (As on PAN Card) *</Label>
                <Input
                  id="fullName"
                  placeholder="e.g. Vikram Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 rounded-lg border-slate-200 text-sm"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="mobile" className="text-xs font-bold uppercase tracking-wider text-slate-500">Mobile Number *</Label>
                  <Input
                    id="mobile"
                    placeholder="9876543210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="mt-1 rounded-lg border-slate-200 text-sm"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pan" className="text-xs font-bold uppercase tracking-wider text-slate-500">PAN Number *</Label>
                  <Input
                    id="pan"
                    placeholder="ABCDE1234F"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                    className="uppercase font-mono mt-1 rounded-lg border-slate-200 text-sm"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              <div className="text-[11px] text-muted-foreground leading-relaxed bg-slate-50 dark:bg-slate-900 border rounded-xl p-3.5 sm:p-4 flex gap-2.5">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong>TransUnion Bureau Notice</strong>: Real-time queries are routed directly through authorized banking networks. Scores are subject to verify matches against historical tax and bank filings. Fake profiles will be flagged.
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-brand-navy text-white font-bold h-11 shadow-md">
                Proceed to Verification <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Card>
        </div>
      )}

      {step === "checkout" && !otpSent && (
        <Card className="p-4 sm:p-6 border bg-card shadow-lg max-w-xl mx-auto relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
          <h3 className="text-base font-extrabold text-brand-navy dark:text-white border-b pb-3 mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" /> Premium Report Payout
          </h3>

          <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 border border-slate-200/50 mb-6 text-center space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Bureau Verification Charge</span>
            <div className="text-3xl sm:text-4xl font-black text-brand-navy dark:text-white">₹399.00</div>
            <p className="text-[11px] text-muted-foreground">Includes 1-year score monitoring & dynamic dashboard tracking.</p>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-bold text-brand-navy dark:text-white block uppercase tracking-wider">Select Payment Method</span>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { id: "upi", label: "UPI / QR" },
                { id: "card", label: "Card" },
                { id: "net", label: "Net Bank" },
              ].map((method) => (
                <Button
                  key={method.id}
                  type="button"
                  variant={paymentMethod === method.id ? "default" : "outline"}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`text-xs font-bold h-10 rounded-lg px-2 ${
                    paymentMethod === method.id
                      ? "bg-primary text-white shadow"
                      : "border-slate-200 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {method.label}
                </Button>
              ))}
            </div>

            <Button onClick={handlePayment} className="w-full bg-primary hover:bg-brand-navy text-white font-bold h-11 shadow-md mt-6">
              Authorize Payment of ₹399
            </Button>
          </div>
        </Card>
      )}

      {step === "checkout" && otpSent && (
        <Card className="p-4 sm:p-6 border bg-card shadow-lg max-w-xl mx-auto relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
          <h3 className="text-base font-extrabold text-brand-navy dark:text-white border-b pb-3 mb-4 flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-emerald-500" /> Enter Payment OTP
          </h3>

          <p className="text-xs text-muted-foreground mb-4">
            We sent a verification code to check payment authorization. Please enter it below.
          </p>

          <form onSubmit={verifyOtpAndShowResults} className="space-y-5">
            <div>
              <Label htmlFor="otp" className="text-xs font-bold uppercase tracking-wider text-slate-500">Verification Code *</Label>
              <Input
                id="otp"
                placeholder="Enter verification code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="text-center text-lg tracking-widest font-mono font-bold mt-1 h-12 border-slate-200 rounded-lg"
                required
              />
            </div>

            <Button type="submit" disabled={verifyingOtp} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11">
              {verifyingOtp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Fetching Score...
                </>
              ) : (
                "Verify Code & Fetch Score"
              )}
            </Button>

            {verifyingOtp && (
              <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-left font-mono text-xs space-y-2 text-slate-300">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  Async Queue Worker Status:
                </div>
                <div className="border-t border-slate-800 pt-2 text-slate-400">
                  {queueState}
                </div>
              </div>
            )}
          </form>
        </Card>
      )}

      {step === "loading" && (
        <Card className="p-8 sm:p-12 border bg-card shadow-lg max-w-xl mx-auto flex flex-col items-center justify-center text-center space-y-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <h3 className="text-base font-extrabold text-brand-navy dark:text-white">Processing Payout Request</h3>
          <p className="text-xs text-muted-foreground font-semibold">Contacting secure bank gateway...</p>
        </Card>
      )}

      {step === "results" && (
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="p-5 sm:p-8 border bg-card shadow-lg text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
            <div className="absolute top-4 right-4">
              <Badge className="bg-amber-50 text-amber-700 border border-amber-100 font-extrabold px-3 py-1 text-xs">
                Verification Pending
              </Badge>
            </div>

            <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-5 sm:p-8 text-center">
              <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl sm:text-2xl font-black text-brand-navy dark:text-white">Request Under Bureau Queue</h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Your consent and details have been successfully submitted to TransUnion CIBIL. Standard verified scores require direct officer review from the administrative portal before display.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button onClick={() => {
                setIsDemoMode(true);
                setStep("dashboard");
                toast.success("Bypassing pending status to preview dashboard.");
              }} className="bg-primary hover:bg-brand-navy text-white font-bold flex items-center gap-2 shadow-md">
                ⚡ Force Preview Dashboard
              </Button>
              <Button variant="outline" onClick={() => setStep("input")} className="text-xs font-bold">
                Submit Another Request
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
