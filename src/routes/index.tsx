import { useState, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import heroImg from "@/assets/hero_new.png";
import founderPhoto from "@/assets/founder.png";
import adminPhoto from "@/assets/admin2.png";
import logo from "@/assets/logo_new.png";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Award,
  Users,
  FileCheck2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Search,
  Briefcase,
  Building,
  GraduationCap,
  Stethoscope,
  Cpu,
  Truck,
  Car,
  HeartPulse,
  Sprout,
  Heart,
  Activity,
  Plane,
  Shield,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Instant Trust Funds — 20+ Years of Financial Services" },
      {
        name: "description",
        content:
          "Apply for Personal, Business, Home, Property and Agricultural Loans or compare Health, Life and Motor Insurance. Trusted banking advisory.",
      },
    ],
  }),
  component: LandingPage,
});

const loanPartners = [
  "SBI", "HDFC Bank", "ICICI Bank", "Axis Bank", "Bank of Baroda", "Punjab National Bank", 
  "Canara Bank", "Union Bank", "Kotak Mahindra Bank", "IDFC FIRST Bank", "Yes Bank", 
  "Bajaj Finserv", "Tata Capital", "Aditya Birla Capital", "Poonawalla Fincorp", 
  "Hero FinCorp", "L&T Finance", "Mahindra Finance", "Cholamandalam Finance", 
  "Shriram Finance", "Tata Motors Finance", "HDB Financial Services", 
  "PNB Housing Finance", "LIC Housing Finance"
];

const insurancePartners = [
  "Star Health", "Niva Bupa", "Care Health", "HDFC ERGO", "ICICI Lombard", "Tata AIG", 
  "SBI General", "Aditya Birla Health", "ManipalCigna", "Reliance General", "LIC", 
  "HDFC Life", "ICICI Prudential", "SBI Life", "Max Life", "Tata AIA", "Bajaj Allianz Life", 
  "Aditya Birla Sun Life", "Kotak Life", "ACKO", "Go Digit", "Bajaj Allianz", "Royal Sundaram"
];

const techPartners = [
  "RenewBuy", "PolicyBazaar Partner", "InsuranceDekho Partner", "Turtlemint", "FinShell",
  "Paisabazaar", "LoanTap", "KreditBee", "MoneyView"
];

const extendedLoans = [
  { name: "Personal Loan", slug: "personal-loan", icon: Users, rate: "10.5%", startingAmt: "₹25 Lakhs", approvalTime: "24h Approval", tagline: "Collateral-free funds for personal milestones & urgent needs." },
  { name: "Business Loan", slug: "business-loan", icon: Briefcase, rate: "11.2%", startingAmt: "₹1 Crore", approvalTime: "48h Approval", tagline: "Fuel your enterprise growth, buy inventory & expand scale." },
  { name: "Home Loan", slug: "property-loan", icon: Building, rate: "8.4%", startingAmt: "₹5 Crore", approvalTime: "3-5 Days", tagline: "Make your dream home a reality with custom tenure options." },
  { name: "Property Loan", slug: "property-loan", icon: LandmarkIcon, rate: "9.25%", startingAmt: "₹10 Crore", approvalTime: "5-7 Days", tagline: "Unlock value from your residential or commercial real estate." },
  { name: "Mortgage Loan", slug: "loan-against-property", icon: LandmarkIcon, rate: "9.5%", startingAmt: "₹7 Crore", approvalTime: "5-7 Days", tagline: "High-value loans secured against fixed asset equity." },
  { name: "Education Loan", slug: "education-loan", icon: GraduationCap, rate: "8.9%", startingAmt: "₹1.5 Crore", approvalTime: "3 Days", tagline: "Global education funding covering fees, travel & stay." },
  { name: "Professional Loan", slug: "professional-loan", icon: Stethoscope, rate: "10.75%", startingAmt: "₹50 Lakhs", approvalTime: "24h Approval", tagline: "Tailored credit lines for Doctors, CA, and Architects." },
  { name: "Professional Equipment Loan", slug: "professional-equipment-loan", icon: Cpu, rate: "11.0%", startingAmt: "₹2 Crore", approvalTime: "3 Days", tagline: "Finance medical machinery, diagnostic units & CA tech." },
  { name: "Commercial Vehicle Loan", slug: "commercial-loan", icon: Truck, rate: "9.8%", startingAmt: "₹1.5 Crore", approvalTime: "48h Approval", tagline: "Funding for trucks, buses & corporate fleets." },
  { name: "Car Loan", slug: "car-loan", icon: Car, rate: "8.7%", startingAmt: "₹50 Lakhs", approvalTime: "24h Approval", tagline: "Drive home your dream hatchback, sedan, or SUV today." },
  { name: "Hospital Funding", slug: "hospital-funding", icon: HeartPulse, rate: "10.5%", startingAmt: "₹10 Crore", approvalTime: "7 Days", tagline: "Capital setup for clinics, diagnostics centers & hospitals." },
  { name: "Agricultural Loan", slug: "property-loan", icon: Sprout, rate: "7.5%", startingAmt: "₹1 Crore", approvalTime: "3 Days", tagline: "Earthy funding for crop inputs, tractors & farm upgrades." }
];

const extendedInsurance = [
  { name: "Health Insurance", slug: "health-insurance", icon: Heart, premium: "₹450/mo", tagline: "Cashless coverage for medical emergencies and major illnesses.", benefits: ["100% Cashless network", "No room rent capping"] },
  { name: "Life Insurance", slug: "life-insurance", icon: Activity, premium: "₹650/mo", tagline: "Secure your family's future with term or endowment coverage.", benefits: ["High sum assured", "Tax benefits U/S 80C"] },
  { name: "Motor Insurance", slug: "motor-insurance", icon: Car, premium: "₹200/mo", tagline: "Third-party and comprehensive covers for two/four-wheelers.", benefits: ["Cashless garages", "Quick claim settling"] },
  { name: "Travel Insurance", slug: "travel-insurance", icon: Plane, premium: "₹150/trip", tagline: "Stay protected against lost baggage and medical expenses abroad.", benefits: ["Instant global support", "Baggage loss cover"] },
  { name: "Property Insurance", slug: "property-insurance", icon: Shield, premium: "₹500/mo", tagline: "Insure your building and household goods against fire and theft.", benefits: ["Fire & flood cover", "Burglary protection"] },
  { name: "Corporate Insurance", slug: "business-insurance", icon: Briefcase, premium: "₹1,200/mo", tagline: "Asset protection, liability, and employee coverage for enterprises.", benefits: ["Keyman insurance", "Asset protection"] },
  { name: "Group Insurance", slug: "family-insurance", icon: Users, premium: "₹250/member", tagline: "Tailored group health & life insurance schemes for workforces.", benefits: ["Easy member additions", "Corporate health plans"] }
];

// Helper icon fallback
function LandmarkIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="3" y1="22" x2="21" y2="22" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12 2 2 7 22 7" />
    </svg>
  );
}

function LandingPage() {
  const navigate = useNavigate();
  const [loanQuery, setLoanQuery] = useState("");

  // EMI Calculator State
  const [loanAmt, setLoanAmt] = useState(1000000); // 10 Lakhs
  const [interestRate, setInterestRate] = useState(8.5); // 8.5%
  const [tenureYears, setTenureYears] = useState(15); // 15 years

  // Age Eligibility State
  const [age, setAge] = useState(28);

  // Search filter
  const filteredLoans = useMemo(() => {
    if (!loanQuery) return extendedLoans;
    return extendedLoans.filter((l) =>
      l.name.toLowerCase().includes(loanQuery.toLowerCase())
    );
  }, [loanQuery]);

  // EMI Calculation formula
  const calculatedEmi = useMemo(() => {
    const P = loanAmt;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;
    if (r === 0) return Math.round(P / n);
    const emiVal = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emiVal);
  }, [loanAmt, interestRate, tenureYears]);

  const totalPayment = calculatedEmi * tenureYears * 12;
  const totalInterest = totalPayment - loanAmt;

  const eligibleProducts = useMemo(() => {
    if (age < 18) return { label: "Underage", desc: "You must be at least 18 years old to apply.", count: 0 };
    if (age > 75) return { label: "Superannuated", desc: "Age exceeds our standard risk limit.", count: 0 };
    if (age >= 18 && age <= 23) {
      return {
        label: "Young Aspirant",
        desc: "Eligible for Education Loans, Car Loans, and basic Health Insurance.",
        count: 3
      };
    }
    if (age >= 24 && age <= 58) {
      return {
        label: "Prime Applicant",
        desc: "Eligible for all Personal, Home, Business, Professional Equipment & Commercial Vehicle Loans, and all Insurance Products.",
        count: 19
      };
    }
    return {
      label: "Senior Professional / Pensioner",
      desc: "Eligible for customized Mortgage Loans, Pensioner Loans, and Senior Citizen Health policies.",
      count: 6
    };
  }, [age]);

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-brand-gradient text-white py-12 px-4 sm:px-6 md:py-24">
        {/* Animated background blobs */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-royal-purple/30 rounded-full filter blur-3xl opacity-40 animate-float pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-lic-blue/20 rounded-full filter blur-3xl opacity-30 animate-float-delayed pointer-events-none" />
        <div className="absolute top-10 right-10 w-60 h-60 bg-turquoise/15 rounded-full filter blur-3xl opacity-25 animate-float pointer-events-none" />

        {/* Floating Icons/Elements */}
        <div className="absolute left-[8%] top-[18%] animate-float opacity-20 pointer-events-none hidden md:block">
          <span className="text-6xl font-black select-none text-gold text-glow-gold">₹</span>
        </div>
        <div className="absolute right-[12%] bottom-[15%] animate-float-delayed opacity-20 pointer-events-none hidden md:block">
          <span className="text-7xl font-black select-none text-turquoise">₹</span>
        </div>
        <div className="absolute left-[35%] bottom-[12%] animate-float opacity-10 pointer-events-none hidden md:block">
          <ShieldCheck className="h-16 w-16 text-white" />
        </div>
        <div className="absolute right-[45%] top-[10%] animate-float-delayed opacity-15 pointer-events-none hidden md:block">
          <Users className="h-12 w-12 text-gold" />
        </div>

        <div className="absolute inset-0 opacity-10 mix-blend-overlay">
          <img src={heroImg} alt="" className="h-full w-full object-cover" loading="eager" />
        </div>

        <div className="relative mx-auto max-w-7xl grid gap-8 lg:gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Logo and Tagline Badge */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <img src={logo} alt="Instant Trust Fund Logo" className="h-10 sm:h-12 w-auto filter drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)] shrink-0" />
              <Badge className="bg-gold hover:bg-gold/90 text-dark-navy font-bold px-3 py-1 text-xs tracking-wider animate-pulse shadow-lg">
                ★ 20+ Years of Trusted Financial Services
              </Badge>
            </div>

            {/* Title / Description */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Instant Funds For You
              </h1>
              <p className="text-xs sm:text-sm font-bold text-accent tracking-wide uppercase bg-white/5 border border-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm leading-relaxed">
                Loans • Insurance • Property Services • Advisory • CIBIL
              </p>
              <p className="text-xs sm:text-base text-white/85 max-w-xl leading-relaxed">
                Access premium, low-interest credit lines and comprehensive family insurance. Leverage our 20+ years of trust and proprietary advisory platforms to match with nationalized lenders instantly.
              </p>
            </div>

            {/* Leadership Banner (Glassmorphic) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center bg-white/5 border border-white/10 p-3 sm:p-4 rounded-2xl backdrop-blur-md max-w-xl shadow-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 sm:h-14 sm:w-14 ring-2 ring-gold shrink-0 shadow-md">
                  <AvatarImage src={founderPhoto} className="object-cover" />
                  <AvatarFallback className="bg-royal-purple text-white">RA</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-gold/90 tracking-wider block">Founder & MD</span>
                  <div className="text-sm font-black text-white truncate">R H Adhoni</div>
                </div>
              </div>
              <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-white/10 pt-2.5 sm:pt-0 sm:pl-3">
                <Avatar className="h-12 w-12 sm:h-14 sm:w-14 ring-2 ring-gold shrink-0 shadow-md">
                  <AvatarImage src={adminPhoto} className="object-cover" />
                  <AvatarFallback className="bg-royal-purple text-white">BA</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-gold/90 tracking-wider block">Chief Administrator</span>
                  <div className="text-sm font-black text-white truncate">Bibi Ayesha</div>
                </div>
              </div>
            </div>

            {/* Instant Loan Search Bar */}
            <div className="max-w-md relative">
              <div className="relative">
                <Search className="absolute left-3 top-3 sm:top-3.5 h-4 sm:h-5 w-4 sm:w-5 text-slate-400 pointer-events-none" />
                <Input
                  placeholder="Search loans (e.g. Home, Personal)..."
                  className="pl-9 pr-24 sm:pr-28 py-5 sm:py-6 bg-white/95 text-dark-navy placeholder:text-slate-400 border-none rounded-xl shadow-xl w-full text-xs font-semibold focus:ring-2 focus:ring-gold"
                  value={loanQuery}
                  onChange={(e) => setLoanQuery(e.target.value)}
                />
                <Button
                  className="absolute right-1.5 top-1.5 sm:right-2 sm:top-2 bg-gradient-to-r from-royal-purple to-lic-blue hover:from-royal-purple hover:to-sbi-blue text-white font-bold text-xs h-8 sm:h-9 px-3 sm:px-4 shadow-md transition-all duration-300"
                  onClick={() => {
                    const el = document.getElementById("loans-grid");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Find Loan
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 sm:gap-4 pt-2">
              <Button
                onClick={() => {
                  const el = document.getElementById("calculator-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex-1 sm:flex-none text-xs sm:text-sm bg-gold text-dark-navy hover:bg-gold/90 font-bold px-4 sm:px-6 shadow-md transition-transform"
              >
                EMI Calculator
              </Button>
              <Button
                onClick={() => {
                  const el = document.getElementById("calculator-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex-1 sm:flex-none text-xs sm:text-sm bg-turquoise text-dark-navy hover:bg-turquoise/90 font-bold px-4 sm:px-6 shadow-md transition-transform"
              >
                Eligibility Appraiser
              </Button>
              <Button
                onClick={() => {
                  const el = document.getElementById("loans-grid");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto text-xs sm:text-sm bg-transparent border border-white/40 hover:bg-white/10 font-bold px-4 sm:px-6 text-white"
              >
                Apply Now &rarr;
              </Button>
            </div>
          </div>

          {/* Quick Quote Widget (Glassmorphism card) */}
          <div className="lg:col-span-5">
            <Card className="p-4 sm:p-6 border bg-glass border-glass backdrop-blur-xl shadow-2xl text-white relative overflow-hidden animate-pulse-glow">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-gold/10 rounded-full filter blur-xl" />
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-gold fill-gold" />
                <h3 className="text-base font-black text-white">Quick Callback Registration</h3>
              </div>
              <p className="text-xs text-white/80 mb-4">Complete quick registration to route requests directly to our advisory queues.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("Callback request captured. An advisor will contact you within 15 minutes.");
                }}
                className="space-y-3"
              >
                <div>
                  <Label htmlFor="reqName" className="text-[10px] uppercase font-bold text-slate-300">Full Name</Label>
                  <Input id="reqName" placeholder="e.g. Vikram Sharma" className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-lg text-xs" required />
                </div>
                <div>
                  <Label htmlFor="reqPhone" className="text-[10px] uppercase font-bold text-slate-300">Mobile Number</Label>
                  <Input id="reqPhone" placeholder="+91 98765 43210" className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-lg text-xs" required />
                </div>
                <div>
                  <Label htmlFor="reqType" className="text-[10px] uppercase font-bold text-slate-300">Required Service</Label>
                  <select id="reqType" className="w-full rounded-lg border border-white/20 bg-dark-navy text-white px-3 py-2 text-xs focus:ring-1 focus:ring-gold">
                    <option>Home Loan</option>
                    <option>Business Loan</option>
                    <option>Personal Loan</option>
                    <option>Term Life Insurance</option>
                    <option>Health Policy</option>
                  </select>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-gold via-soft-pink to-turquoise hover:from-turquoise hover:to-gold text-dark-navy font-bold text-sm mt-3 py-4 sm:py-5 shadow-lg transition-all duration-500">
                  Request Call Back
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
      {/* 2. Channel Partners Section */}
      <section className="bg-gradient-to-b from-lic-blue/10 via-sbi-blue/5 to-gold/10 py-12 sm:py-16 border-b overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-gold fill-gold animate-pulse" />
              <Badge className="bg-gold text-dark-navy font-bold">Network Reach</Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-navy md:text-4xl">Our Trusted Channel Partners</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We proudly partner with India's leading banks, NBFCs, insurance companies, and financial institutions to provide the best loan and insurance solutions.
            </p>
          </div>

          {/* Marquees */}
          <div className="space-y-8 w-full overflow-hidden">
            {/* Lending Partners Marquee */}
            <div className="space-y-2">
              <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Associate Lending Banks & NBFCs</h4>
              <div className="relative flex overflow-x-hidden py-2">
                <div className="animate-marquee flex gap-3 sm:gap-4 whitespace-nowrap items-center">
                  {loanPartners.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-2 border border-slate-200/50 bg-white/70 backdrop-blur-md px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-sm hover:shadow-md hover:border-gold/50 transition-all duration-300 shrink-0 cursor-pointer">
                      <span className="h-2 w-2 rounded-full bg-sbi-blue inline-block shadow-sm" />
                      <span className="text-xs font-extrabold text-brand-navy tracking-tight">{p}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute top-2 animate-marquee2 flex gap-3 sm:gap-4 whitespace-nowrap items-center">
                  {loanPartners.map((p, idx) => (
                    <div key={`dup-${idx}`} className="flex items-center gap-2 border border-slate-200/50 bg-white/70 backdrop-blur-md px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-sm hover:shadow-md hover:border-gold/50 transition-all duration-300 shrink-0 cursor-pointer">
                      <span className="h-2 w-2 rounded-full bg-sbi-blue inline-block shadow-sm" />
                      <span className="text-xs font-extrabold text-brand-navy tracking-tight">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Insurance Partners Marquee */}
            <div className="space-y-2">
              <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Authorized Insurance Carriers</h4>
              <div className="relative flex overflow-x-hidden py-2">
                <div className="animate-marquee flex gap-3 sm:gap-4 whitespace-nowrap items-center [animation-direction:reverse]">
                  {insurancePartners.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-2 border border-slate-200/50 bg-white/70 backdrop-blur-md px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-sm hover:shadow-md hover:border-gold/50 transition-all duration-300 shrink-0 cursor-pointer">
                      <span className="h-2 w-2 rounded-full bg-lic-blue inline-block shadow-sm" />
                      <span className="text-xs font-extrabold text-brand-navy tracking-tight">{p}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute top-2 animate-marquee2 flex gap-3 sm:gap-4 whitespace-nowrap items-center [animation-direction:reverse]">
                  {insurancePartners.map((p, idx) => (
                    <div key={`dup-${idx}`} className="flex items-center gap-2 border border-slate-200/50 bg-white/70 backdrop-blur-md px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-sm hover:shadow-md hover:border-gold/50 transition-all duration-300 shrink-0 cursor-pointer">
                      <span className="h-2 w-2 rounded-full bg-lic-blue inline-block shadow-sm" />
                      <span className="text-xs font-extrabold text-brand-navy tracking-tight">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Technology & Distribution Partners Marquee */}
            <div className="space-y-2">
              <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Technology & Distribution Partners</h4>
              <div className="relative flex overflow-x-hidden py-2">
                <div className="animate-marquee flex gap-3 sm:gap-4 whitespace-nowrap items-center">
                  {techPartners.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-2 border border-slate-200/50 bg-white/70 backdrop-blur-md px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-sm hover:shadow-md hover:border-gold/50 transition-all duration-300 shrink-0 cursor-pointer">
                      <span className="h-2 w-2 rounded-full bg-turquoise inline-block shadow-sm" />
                      <span className="text-xs font-extrabold text-brand-navy tracking-tight">{p}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute top-2 animate-marquee2 flex gap-3 sm:gap-4 whitespace-nowrap items-center">
                  {techPartners.map((p, idx) => (
                    <div key={`dup-${idx}`} className="flex items-center gap-2 border border-slate-200/50 bg-white/70 backdrop-blur-md px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-sm hover:shadow-md hover:border-gold/50 transition-all duration-300 shrink-0 cursor-pointer">
                      <span className="h-2 w-2 rounded-full bg-turquoise inline-block shadow-sm" />
                      <span className="text-xs font-extrabold text-brand-navy tracking-tight">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 2.5 Statistics Section */}
      <section className="bg-gradient-to-br from-sbi-blue/10 via-gold/5 to-lic-blue/10 py-12 sm:py-16 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid gap-3 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { val: "20+", label: "Years Experience", desc: "Trusted banking consulting since 2006", color: "from-royal-purple to-lic-blue" },
              { val: "25+", label: "Partner Banks", desc: "Nationalized & private banking tie-ups", color: "from-lic-blue to-sbi-blue" },
              { val: "10,000+", label: "Happy Customers", desc: "Served across Karnataka & beyond", color: "from-sbi-blue to-turquoise" },
              { val: "₹250 Cr+", label: "Loans Processed", desc: "Substantial capital disbursements", color: "from-royal-purple to-soft-pink" },
              { val: "98%", label: "Approval Success", desc: "Industry-leading approval rates", color: "from-soft-pink to-gold" }
            ].map((stat, idx) => (
              <Card key={idx} className={`p-4 sm:p-6 border border-slate-200/50 bg-white/70 backdrop-blur-md shadow-md hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 text-center relative overflow-hidden group ${idx === 4 ? "col-span-2 lg:col-span-1" : ""}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-royal-purple to-lic-blue opacity-70" />
                <span className={`text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent block mb-1 group-hover:scale-105 transition-transform`}>
                  {stat.val}
                </span>
                <span className="text-[11px] sm:text-xs font-black text-brand-navy block tracking-wide uppercase mb-1">
                  {stat.label}
                </span>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-snug">
                  {stat.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="loans-grid" className="bg-gradient-to-b from-lic-blue/10 via-gold/5 to-sbi-blue/10 px-4 sm:px-6 py-12 sm:py-20 space-y-8 sm:space-y-10 border-b">
        <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
          <Badge className="bg-gradient-to-r from-royal-purple to-lic-blue text-white font-bold shadow-md px-3 py-1 text-xs">12 Active Products</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">Explore Customized Loans</h2>
          <p className="text-xs text-muted-foreground">Find structured interest rates, low processing fees, and doorstep delivery for all categories.</p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl mx-auto">
          {filteredLoans.map((l) => {
            const IconComponent = l.icon;
            return (
              <Card key={l.name} className="p-5 sm:p-6 border border-slate-200/50 bg-white/70 backdrop-blur-md shadow-md hover:shadow-elevated transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden group">
                {/* Visual Accent Gradient Border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-royal-purple via-lic-blue to-sbi-blue opacity-80" />
                
                {/* Icon Wrapper with Glow */}
                <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-royal-purple/10 to-lic-blue/10 text-royal-purple flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300 group-hover:from-royal-purple group-hover:to-lic-blue group-hover:text-white shadow-inner">
                  <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>

                <h3 className="font-extrabold text-brand-navy group-hover:text-primary transition-colors text-sm">{l.name}</h3>
                <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed min-h-[44px]">{l.tagline}</p>
                
                {/* Parameters Breakdown */}
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-[10px]">
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100/50">
                    <span className="text-muted-foreground block font-bold uppercase tracking-wider scale-[0.9] origin-left">Rate Starting</span>
                    <span className="font-black text-emerald-600">from {l.rate}</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100/50 text-right">
                    <span className="text-muted-foreground block font-bold uppercase tracking-wider scale-[0.9] origin-right">Up To</span>
                    <span className="font-black text-brand-navy">{(l as any).startingAmt}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-1">
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded">
                    {(l as any).approvalTime}
                  </Badge>
                  <Link to="/loans/$slug" params={{ slug: l.slug }} className="text-xs text-primary font-black hover:underline flex items-center gap-1 group/btn">
                    Apply Now <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
      {/* 4. Interactive Calculators Section */}
      <section id="calculator-section" className="bg-gradient-to-tr from-sbi-blue/10 via-lic-blue/5 to-gold/10 border-t border-b py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid gap-8 lg:gap-12 lg:grid-cols-2">
          {/* EMI Calculator */}
          <Card className="p-4 sm:p-6 border border-slate-200/50 bg-white/70 backdrop-blur-md shadow-card space-y-5 sm:space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-brand-navy">EMI Repayment Estimator</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Calculate your monthly outflow instantly based on loan parameters.</p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Loan Amount</span>
                  <span className="text-primary font-black">₹{loanAmt.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={50000000}
                  step={50000}
                  value={loanAmt}
                  onChange={(e) => setLoanAmt(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Annual Interest Rate (%)</span>
                  <span className="text-primary font-black">{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={20}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Tenure (Years)</span>
                  <span className="text-primary font-black">{tenureYears} yrs</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
              <div className="bg-slate-50 p-2.5 sm:p-3 rounded-lg border">
                <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Monthly EMI</span>
                <span className="text-sm font-black text-brand-navy">₹{calculatedEmi.toLocaleString()}</span>
              </div>
              <div className="bg-slate-50 p-2.5 sm:p-3 rounded-lg border">
                <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Total Interest</span>
                <span className="text-sm font-black text-brand-navy">₹{totalInterest.toLocaleString()}</span>
              </div>
              <div className="bg-slate-50 p-2.5 sm:p-3 rounded-lg border text-primary">
                <span className="text-[10px] text-primary/80 uppercase block font-semibold">Total Payment</span>
                <span className="text-sm font-black">₹{totalPayment.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Age Calculator */}
          <Card className="p-4 sm:p-6 border border-slate-200/50 bg-white/70 backdrop-blur-md shadow-card space-y-5 sm:space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-brand-navy">Age Eligibility Appraiser</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Toggle your age value below to discover custom portfolio matches.</p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Current Age</span>
                  <span className="text-primary font-black">{age} Years Old</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={80}
                  step={1}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            <div className="border-t pt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-navy">{eligibleProducts.label}</span>
                <Badge className="bg-gold text-dark-navy font-bold text-[10px]">
                  {eligibleProducts.count} Active Matches
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{eligibleProducts.desc}</p>
            </div>
          </Card>
        </div>
      </section>

      {/* 5. CIBIL Services Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <Card className="bg-gradient-to-r from-royal-purple to-lic-blue text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-elevated grid md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <Badge className="bg-gold text-dark-navy font-bold px-2 py-0.5 text-xs">Powered by TransUnion</Badge>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">Check Your CIBIL Score Online</h2>
            <p className="text-xs text-white/90 max-w-xl leading-relaxed">
              Understand your creditworthiness, access personalized loan eligibility guidance, and track bureau requests securely. Charges apply only when an authorised provider confirms a request.
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col gap-2">
            <Link to="/cibil">
              <Button className="w-full bg-gold text-dark-navy hover:bg-gold/90 font-bold text-xs sm:text-sm py-2 sm:py-2.5">
                Generate CIBIL Report
              </Button>
            </Link>
            <Button
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-xs sm:text-sm"
              onClick={() => toast.success("Loading credit score improvement guidelines...")}
            >
              Improve Score
            </Button>
            <Button
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-xs sm:text-sm"
              onClick={() => toast.success("Loan eligibility request initiated.")}
            >
              Eligibility Report
            </Button>
          </div>
        </Card>
      </section>
      {/* 6. Insurance Categories */}
      <section id="insurance-grid" className="bg-gradient-to-br from-gold/10 via-lic-blue/5 to-sbi-blue/10 py-12 sm:py-20 px-4 sm:px-6 border-t border-b">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
            <Badge className="bg-gradient-to-r from-lic-blue to-sbi-blue text-white font-bold shadow-md px-3 py-1 text-xs">7 Active Coverages</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">All Insurance Covers</h2>
            <p className="text-xs text-muted-foreground">Cashless coverage, quick claim support, and hassle-free online renewals.</p>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {extendedInsurance.map((i) => {
              const Icon = i.icon;
              return (
                <Card key={i.name} className="p-5 sm:p-6 border border-slate-200/50 bg-white/70 backdrop-blur-md shadow-md hover:shadow-elevated transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden group">
                  {/* Decorative Border */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lic-blue via-sbi-blue to-turquoise opacity-85" />
                  
                  {/* Icon with glow */}
                  <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-lic-blue/10 to-sbi-blue/10 text-lic-blue flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300 group-hover:from-lic-blue group-hover:to-sbi-blue group-hover:text-white shadow-inner">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>

                  <h3 className="font-extrabold text-brand-navy group-hover:text-secondary transition-colors text-sm">{i.name}</h3>
                  <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed min-h-[44px]">{i.tagline}</p>
                  
                  {/* Benefits Checklist */}
                  <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                    {(i as any).benefits.map((b: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-600">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-1">
                    <span className="text-[10px] font-black text-white bg-lic-blue px-2.5 py-1 rounded-lg">
                      {i.premium}
                    </span>
                    <Link to="/insurance/$slug" params={{ slug: i.slug }} className="text-xs text-secondary font-black hover:underline flex items-center gap-1 group/btn">
                      Compare Plans <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      {/* 6.5 RenewBuy Channel Partner Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Card className="bg-gradient-to-r from-slate-900 via-brand-navy to-slate-900 text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden grid md:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-soft-pink/10 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-gold/10 rounded-full filter blur-3xl pointer-events-none" />
          
          <div className="md:col-span-8 space-y-3 sm:space-y-4 relative z-10">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#E31E24] animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-200">Authorized Channel Partner</span>
              </div>
              <Badge className="bg-gold text-dark-navy font-black text-xs">RENEWBUY INTEGRATION</Badge>
            </div>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
              Compare &amp; Purchase via RenewBuy Partner Network
            </h2>
            
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              We are an authorized RenewBuy Channel Partner, enabling customers to compare and purchase insurance products from multiple leading insurers through a single trusted platform. This partnership helps us provide competitive premiums, faster policy issuance, seamless renewals, and dedicated claim assistance.
            </p>
          </div>
          
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 sm:p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md shadow-inner gap-4 relative z-10">
            {/* RenewBuy SVG Logo */}
            <div className="bg-white px-5 py-3 rounded-xl shadow-md border border-slate-100 flex items-center justify-center">
              <svg viewBox="0 0 200 50" className="h-7 sm:h-8 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25" cy="25" r="18" fill="#E31E24" />
                <path d="M18 25 L23 30 L32 18" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <text x="52" y="32" fill="#1E293B" fontSize="22" fontWeight="black" fontFamily="sans-serif">renew</text>
                <text x="122" y="32" fill="#E31E24" fontSize="22" fontWeight="black" fontFamily="sans-serif">buy</text>
              </svg>
            </div>
            
            <div className="w-full space-y-2">
              <Link to="/insurance">
                <Button className="w-full bg-gold text-dark-navy hover:bg-gold/90 font-bold text-xs py-3 sm:py-4 rounded-xl shadow-md transition-all duration-300">
                  Explore Insurance
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 font-bold text-xs py-3 sm:py-4 rounded-xl transition-all duration-300"
                onClick={() => {
                  const el = document.getElementById("callback-form");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                    toast.success("Callback form located. Please fill details to get a quote.");
                  }
                }}
              >
                Get a Quote
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* 7. Loan Approval Timeline */}
      <section className="mx-4 sm:mx-auto max-w-7xl my-8 sm:my-12 p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-sbi-blue/10 via-lic-blue/5 to-gold/10 border border-slate-200/50 shadow-xl space-y-6 sm:space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-1 sm:space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">Fast Approval Timeline</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Get your funds dispersed with minimal roadblocks. Here is our workflow:</p>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {[
            { step: "1", title: "Enquire Online", desc: "Select product, fill primary parameters, and generate credit app." },
            { step: "2", title: "Verify Credentials", desc: "Complete paperless KYC check and appraise loan parameters." },
            { step: "3", title: "Property Audit", desc: "For secure loans, survey parcels mapped using Bhoomi & Dishank." },
            { step: "4", title: "Disbursal", desc: "Approved amount routed to your verified bank account in 24 hours." }
          ].map((item, idx) => (
            <Card key={idx} className="p-4 sm:p-6 border shadow-sm relative overflow-hidden">
              <span className="absolute right-3 top-3 text-3xl sm:text-4xl font-black text-slate-100">{item.step}</span>
              <h4 className="font-bold text-brand-navy text-xs sm:text-sm relative z-10">{item.title}</h4>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-2 leading-relaxed relative z-10">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 8. FAQs */}
      <section className="bg-gradient-to-b from-lic-blue/10 via-sbi-blue/5 to-gold/10 py-12 sm:py-16 px-4 sm:px-6 border-t border-b">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          <div className="text-center space-y-1 sm:space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">Frequently Asked Questions</h2>
            <p className="text-xs text-muted-foreground">General inquiries about eligibility, documents, and interest calculation.</p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {[
              { q: "What is the average timeline for loan sanction?", a: "Unsecured personal and business loans are approved within 24 hours. Mortgages and home loans take 4-7 banking days depending on local land audits." },
              { q: "Do you charge extra consulting fee?", a: "No, Instant Trust Fund provides transparent advisory comparisons. Our consulting costs are covered directly by lending partners without adding marks to your rates." },
              { q: "How are properties verified?", a: "We sync with Karnataka Bhoomi title servers and Dishank spatial coordinates to run primary verification on secure land properties." }
            ].map((faq, idx) => (
              <Card key={idx} className="p-4 sm:p-5 border border-slate-200/50 bg-white/70 backdrop-blur-md shadow-sm space-y-1.5 sm:space-y-2">
                <h4 className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-primary shrink-0" /> {faq.q}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed pl-5.5">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
