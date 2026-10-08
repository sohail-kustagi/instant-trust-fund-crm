import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Sparkles,
  FileText,
  IndianRupee,
} from "lucide-react";
import type { CatalogItem } from "@/lib/catalog";
import { findCatalogItem } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ApplyDialog } from "@/components/apply-dialog";
import { EmiCalculator } from "@/components/emi-calculator";
import { AgeCalculator } from "@/components/age-calculator";

const PARTNER_BRANDS: Record<string, { bg: string; text: string; label: string }> = {
  "HDFC Bank": { bg: "#004C8F", text: "#FFFFFF", label: "HDFC BANK" },
  "ICICI Bank": { bg: "#8F2A28", text: "#FFC72C", label: "ICICI BANK" },
  "Axis Bank": { bg: "#971B49", text: "#FFFFFF", label: "AXIS BANK" },
  "Kotak Mahindra Bank": { bg: "#DD1B1F", text: "#FFFFFF", label: "KOTAK BANK" },
  "SBI": { bg: "#005BAC", text: "#FFFFFF", label: "SBI" },
  "Bank of Baroda": { bg: "#F05A28", text: "#FFFFFF", label: "BOB" },
  "Punjab National Bank": { bg: "#A20F16", text: "#FFFFFF", label: "PNB" },
  "Union Bank": { bg: "#0D47A1", text: "#FFFFFF", label: "UNION BANK" },
  "Canara Bank": { bg: "#006FB4", text: "#FFFFFF", label: "CANARA BANK" },
  "IDFC FIRST Bank": { bg: "#9E1B1E", text: "#FFFFFF", label: "IDFC FIRST" },
  "AU Small Finance Bank": { bg: "#4C276E", text: "#FFFFFF", label: "AU SFB" },
  "Yes Bank": { bg: "#0F4B91", text: "#FFFFFF", label: "YES BANK" },
  "IndusInd Bank": { bg: "#800000", text: "#FFC72C", label: "INDUSIND" },
  "Bajaj Finserv": { bg: "#005596", text: "#FFFFFF", label: "BAJAJ FINSERV" },
  "Tata Capital": { bg: "#00A4E4", text: "#FFFFFF", label: "TATA CAPITAL" },
  "Aditya Birla Capital": { bg: "#D32F2F", text: "#FFFFFF", label: "ADITYA BIRLA" },
  "L&T Finance": { bg: "#00796B", text: "#FFFFFF", label: "L&T FINANCE" },
  "Poonawalla Fincorp": { bg: "#1565C0", text: "#FFFFFF", label: "POONAWALLA" },
  "Hero FinCorp": { bg: "#E53935", text: "#FFFFFF", label: "HERO FINCORP" },
  "Piramal Finance": { bg: "#2E7D32", text: "#FFFFFF", label: "PIRAMAL" },
  "Shriram Finance": { bg: "#FFB300", text: "#1E293B", label: "SHRIRAM" },
  "Cholamandalam Finance": { bg: "#0A3B75", text: "#FFFFFF", label: "CHOLA" },
  "Mahindra Finance": { bg: "#E31B23", text: "#FFFFFF", label: "MAHINDRA" },
  "Tata Motors Finance": { bg: "#00A4E4", text: "#FFFFFF", label: "TATA MOTORS" },
  "HDB Financial Services": { bg: "#004C8F", text: "#FFFFFF", label: "HDB" },
  "PNB Housing Finance": { bg: "#A20F16", text: "#FFFFFF", label: "PNB HOUSING" },
  "LIC Housing Finance": { bg: "#0054A6", text: "#FFD200", label: "LIC HOUSING" },
  "ICICI Lombard": { bg: "#8F2A28", text: "#FFFFFF", label: "ICICI LOMBARD" },
  "HDFC ERGO": { bg: "#004C8F", text: "#FFFFFF", label: "HDFC ERGO" },
  "Niva Bupa": { bg: "#0082C3", text: "#FFFFFF", label: "NIVA BUPA" },
  "Star Health": { bg: "#00599B", text: "#FFFFFF", label: "STAR HEALTH" },
  "Care Health": { bg: "#4CAF50", text: "#FFFFFF", label: "CARE HEALTH" },
  "Tata AIG": { bg: "#002B49", text: "#FFFFFF", label: "TATA AIG" },
  "SBI General": { bg: "#005BAC", text: "#FFFFFF", label: "SBI GENERAL" },
  "Reliance General": { bg: "#005BAC", text: "#FFFFFF", label: "RELIANCE GEN" },
  "Bajaj Allianz": { bg: "#005BAC", text: "#FFFFFF", label: "BAJAJ ALLIANZ" },
  "Aditya Birla Health": { bg: "#D32F2F", text: "#FFFFFF", label: "ADITYA BIRLA" },
  "ManipalCigna": { bg: "#007A87", text: "#FFFFFF", label: "MANIPALCIGNA" },
  "Future Generali": { bg: "#C62828", text: "#FFFFFF", label: "FUTURE GENERALI" },
  "Kotak General Insurance": { bg: "#DD1B1F", text: "#FFFFFF", label: "KOTAK GENERAL" },
  "Go Digit": { bg: "#FFC72C", text: "#1A1A1A", label: "DIGIT" },
  "ACKO": { bg: "#1AC7C2", text: "#FFFFFF", label: "ACKO" },
  "Royal Sundaram": { bg: "#0D47A1", text: "#FFFFFF", label: "ROYAL SUNDARAM" },
  "Liberty General": { bg: "#1565C0", text: "#FFFFFF", label: "LIBERTY" },
  "RenewBuy": { bg: "#E31E24", text: "#FFFFFF", label: "RENEWBUY" },
  "PolicyBazaar Partner": { bg: "#FF5A00", text: "#FFFFFF", label: "POLICYBAZAAR" },
  "InsuranceDekho Partner": { bg: "#009688", text: "#FFFFFF", label: "INSURANCEDEKHO" },
  "Turtlemint": { bg: "#00A4E4", text: "#FFFFFF", label: "TURTLEMINT" },
  "FinShell": { bg: "#00B0FF", text: "#FFFFFF", label: "FINSHELL" },
  "Rupeek (Gold Loans)": { bg: "#008080", text: "#FFFFFF", label: "RUPEEK" },
  "Paisabazaar": { bg: "#002A54", text: "#FFFFFF", label: "PAISABAZAAR" },
  "LoanTap": { bg: "#00C853", text: "#FFFFFF", label: "LOANTAP" },
  "KreditBee": { bg: "#FF6F00", text: "#FFFFFF", label: "KREDITBEE" },
  "MoneyView": { bg: "#3F51B5", text: "#FFFFFF", label: "MONEYVIEW" },
  "Muthoot Finance": { bg: "#E31E24", text: "#FFFFFF", label: "MUTHOOT" },
  "Manappuram Finance": { bg: "#FFB300", text: "#1E293B", label: "MANAPPURAM" },
  "Rupeek": { bg: "#008080", text: "#FFFFFF", label: "RUPEEK" },
  "HDFC Credila": { bg: "#004C8F", text: "#FFFFFF", label: "HDFC CREDILA" },
  "HDFC Life": { bg: "#004C8F", text: "#FFFFFF", label: "HDFC LIFE" },
  "ICICI Prudential": { bg: "#8F2A28", text: "#FFFFFF", label: "ICICI PRU" },
  "SBI Life": { bg: "#005BAC", text: "#FFFFFF", label: "SBI LIFE" },
  "Max Life": { bg: "#0F2D59", text: "#FFFFFF", label: "MAX LIFE" },
  "Tata AIA": { bg: "#002B49", text: "#FFFFFF", label: "TATA AIA" },
  "LIC": { bg: "#0054A6", text: "#FFD200", label: "LIC" },
  "Bajaj Allianz Life": { bg: "#005BAC", text: "#FFFFFF", label: "BAJAJ LIFE" },
  "Aditya Birla Sun Life": { bg: "#D32F2F", text: "#FFFFFF", label: "ADITYA SUN LIFE" },
  "Kotak Life": { bg: "#DD1B1F", text: "#FFFFFF", label: "KOTAK LIFE" },
};

const getProductPartners = (slug: string, kind: string): string[] => {
  if (kind === "loan") {
    switch (slug) {
      case "property-loan":
      case "home-loan":
        return [
          "SBI",
          "HDFC Bank",
          "ICICI Bank",
          "Axis Bank",
          "Bank of Baroda",
          "Punjab National Bank",
          "Canara Bank",
          "Union Bank",
          "Kotak Mahindra Bank",
          "IDFC FIRST Bank",
        ];
      case "personal-loan":
      case "professional-loan":
      case "professional-equipment-loan":
        return [
          "HDFC Bank",
          "ICICI Bank",
          "Axis Bank",
          "Kotak Mahindra Bank",
          "IDFC FIRST Bank",
          "Yes Bank",
          "Bajaj Finserv",
          "Tata Capital",
          "Aditya Birla Capital",
          "Poonawalla Fincorp",
          "Hero FinCorp",
          "L&T Finance",
        ];
      case "business-loan":
      case "hospital-funding":
      case "educational-institution-funding":
        return [
          "HDFC Bank",
          "ICICI Bank",
          "Axis Bank",
          "Tata Capital",
          "Bajaj Finserv",
          "Aditya Birla Capital",
          "L&T Finance",
          "Poonawalla Fincorp",
          "IDFC FIRST Bank",
          "Kotak Mahindra Bank",
        ];
      case "car-loan":
      case "commercial-loan":
        return [
          "SBI",
          "HDFC Bank",
          "ICICI Bank",
          "Axis Bank",
          "Mahindra Finance",
          "Cholamandalam Finance",
          "Shriram Finance",
          "Tata Motors Finance",
          "HDB Financial Services",
        ];
      case "education-loan":
        return [
          "SBI",
          "HDFC Bank",
          "ICICI Bank",
          "Axis Bank",
          "Canara Bank",
          "Bank of Baroda",
          "Punjab National Bank",
          "Union Bank",
        ];
      case "loan-against-property":
        return [
          "SBI",
          "HDFC Bank",
          "ICICI Bank",
          "Axis Bank",
          "Tata Capital",
          "Bajaj Finserv",
          "Aditya Birla Capital",
          "Kotak Mahindra Bank",
          "PNB Housing Finance",
          "LIC Housing Finance",
        ];
      default:
        return ["SBI", "HDFC Bank", "ICICI Bank", "Axis Bank"];
    }
  } else if (kind === "insurance") {
    switch (slug) {
      case "health-insurance":
      case "family-insurance":
        return [
          "Star Health",
          "Niva Bupa",
          "Care Health",
          "HDFC ERGO",
          "ICICI Lombard",
          "Tata AIG",
          "SBI General",
          "Aditya Birla Health",
          "ManipalCigna",
          "Reliance General",
        ];
      case "life-insurance":
      case "child-plans":
      case "pension-plans":
        return [
          "LIC",
          "HDFC Life",
          "ICICI Prudential",
          "SBI Life",
          "Max Life",
          "Tata AIA",
          "Bajaj Allianz Life",
          "Aditya Birla Sun Life",
          "Kotak Life",
        ];
      case "motor-insurance":
        return [
          "ICICI Lombard",
          "HDFC ERGO",
          "Tata AIG",
          "Reliance General",
          "ACKO",
          "Go Digit",
          "Bajaj Allianz",
          "SBI General",
          "Royal Sundaram",
        ];
      case "travel-insurance":
        return [
          "Tata AIG",
          "ICICI Lombard",
          "HDFC ERGO",
          "Reliance General",
          "Bajaj Allianz",
        ];
      default:
        return ["ICICI Lombard", "HDFC ERGO", "Tata AIG", "Bajaj Allianz"];
    }
  }
  return [];
};

function ProductPartners({ slug, kind }: { slug: string; kind: string }) {
  const partners = getProductPartners(slug, kind);
  if (partners.length === 0) return null;

  return (
    <section className="bg-gradient-to-r from-lic-blue/10 via-sbi-blue/5 to-gold/10 border-t border-b py-12">
      <div className="mx-auto max-w-7xl px-6 text-center space-y-6">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-brand-navy">
            {kind === "loan"
              ? "Available Through Our Trusted Lending Partners"
              : "Available Through Our Trusted Insurance Partners"}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Official partnership channels for fast processing &amp; lower rates.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mt-6">
          {partners.map((p) => {
            const config = PARTNER_BRANDS[p] || { bg: "#0066CC", text: "#FFFFFF", label: p.toUpperCase() };
            return (
              <div
                key={p}
                className="flex items-center gap-2 sm:gap-3 bg-white/80 border border-slate-200/60 px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-elevated hover:scale-105 hover:border-gold/50 transition-all duration-300 cursor-pointer group"
                title={p}
              >
                <div
                  className="flex items-center justify-center h-7 sm:h-8 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black tracking-tighter uppercase shadow-inner select-none transition-all group-hover:brightness-110"
                  style={{ backgroundColor: config.bg, color: config.text }}
                >
                  {config.label}
                </div>
                <span className="text-[11px] sm:text-xs font-black text-brand-navy group-hover:text-primary transition-colors">
                  {p}
                </span>
              </div>
            );
          })}
        </div>
        
        <p className="text-[10px] text-slate-500 italic mt-4 max-w-2xl mx-auto px-2">
          * {kind === "loan"
            ? "Loan approval, interest rates, and eligibility are determined by the respective financial institution."
            : "Policy approval, premiums, and eligibility are determined by the respective insurance provider."}
        </p>
      </div>
    </section>
  );
}

export function CategoryPage({ item }: { item: CatalogItem }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-gradient text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 py-10 sm:py-16 md:grid-cols-2 md:py-20">
          <div className="flex flex-col justify-center">
            <Badge className="mb-3 sm:mb-4 w-fit bg-accent text-accent-foreground hover:bg-accent text-xs">
              {item.kind === "loan" ? "Loan Product" : "Insurance Plan"}
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">{item.name}</h1>
            <p className="mt-2 sm:mt-3 text-base sm:text-lg text-white/85">{item.tagline}</p>
            <p className="mt-3 sm:mt-4 max-w-xl text-xs sm:text-sm text-white/75 leading-relaxed">{item.description}</p>
            {item.kind === "insurance" && (
              <div className="mt-4 rounded-xl border border-white/20 bg-white/10 p-3 text-[11px] text-white/90 backdrop-blur-sm max-w-xl leading-relaxed">
                🛡️ **Policybazaar Partner Integration**: In production, real-time premium tables and direct policy comparison depend on official partnership API contracts with Policybazaar and regulatory IRDAI clearances.
              </div>
            )}
            <div className="mt-5 sm:mt-6 flex flex-wrap gap-2.5 sm:gap-3">
              <ApplyDialog productName={item.name} productKind={item.kind}>
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs sm:text-sm px-4 sm:px-6">
                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </ApplyDialog>
              <a href="#details">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-white/10 text-white hover:bg-white/20 text-xs sm:text-sm px-4 sm:px-6"
                >
                  Learn more
                </Button>
              </a>
            </div>
            <div className="mt-5 sm:mt-6 flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-white/80">
              {item.rate && (
                <span className="flex items-center gap-1.5">
                  <IndianRupee className="h-4 w-4" />
                  {item.rate}
                </span>
              )}
              {item.tenure && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {item.tenure}
                </span>
              )}
              {item.premium && (
                <span className="flex items-center gap-1.5">
                  <IndianRupee className="h-4 w-4" />
                  {item.premium}
                </span>
              )}
              {item.coverage && (
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  {item.coverage}
                </span>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-accent/30 blur-2xl" />
            <img
              src={item.image}
              alt={item.name}
              className="relative aspect-[4/3] w-full rounded-2xl object-cover shadow-elevated"
              width={1200}
              height={700}
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Key features */}
      <section id="details" className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {item.features.map((f) => (
            <Card key={f} className="flex items-start gap-3 p-3.5 sm:p-4">
              <Sparkles className="mt-0.5 h-4 sm:h-5 w-4 sm:w-5 text-primary shrink-0" />
              <div className="text-xs sm:text-sm font-medium">{f}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Sub-types */}
      {item.subtypes && (
        <section className="bg-secondary/40 py-10 sm:py-14 border-t border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Available variants</h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
              Choose the option that best fits your goal.
            </p>
            <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {item.subtypes.map((s) => (
                <Card key={s.name} className="p-4 sm:p-5 transition hover:shadow-elevated">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-md bg-primary/10 p-1.5 text-primary shrink-0">
                      <ShieldCheck className="h-full w-full" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm">{s.name}</h3>
                  </div>
                  <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits / Eligibility / Docs */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold">Benefits</h3>
            <ul className="mt-3 sm:mt-4 space-y-2 text-xs sm:text-sm">
              {item.benefits.map((b) => (
                <li key={b} className="flex gap-2">
                  <CheckCircle2 className="h-4 sm:h-5 w-4 sm:w-5 shrink-0 text-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold">Eligibility</h3>
            <ul className="mt-3 sm:mt-4 space-y-2 text-xs sm:text-sm">
              {item.eligibility.map((b) => (
                <li key={b} className="flex gap-2">
                  <CheckCircle2 className="h-4 sm:h-5 w-4 sm:w-5 shrink-0 text-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold">Documents Required</h3>
            <ul className="mt-3 sm:mt-4 space-y-2 text-xs sm:text-sm">
              {item.documents.map((b) => (
                <li key={b} className="flex gap-2">
                  <FileText className="h-4 sm:h-5 w-4 sm:w-5 shrink-0 text-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* Associated Banks & Insurers */}
      {item.kind !== "service" && <ProductPartners slug={item.slug} kind={item.kind} />}

      {/* EMI Calculator (loans only) */}
      {item.kind === "loan" && (
        <section className="bg-secondary/40 py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold md:text-3xl">EMI Calculator</h2>
            <p className="mt-2 text-muted-foreground">Plan your monthly outgo before you apply.</p>
            <div className="mt-8">
              <EmiCalculator
                defaultRate={parseFloat((item.rate || "9").replace(/[^0-9.]/g, "")) || 9}
                defaultAmount={
                  item.slug === "personal-loan"
                    ? 500000
                    : item.slug === "car-loan"
                      ? 1000000
                      : 2500000
                }
                defaultYears={
                  item.slug === "car-loan" ? 5 : item.slug === "personal-loan" ? 4 : 20
                }
              />
            </div>
          </div>
        </section>
      )}

      {/* Age Eligibility Check (loans only) */}
      {item.kind === "loan" && (
        <section className="py-14 border-t border-b">
          <div className="mx-auto max-w-7xl px-6">
            <AgeCalculator />
          </div>
        </section>
      )}

      {/* FAQs */}
      <section className="mx-auto max-w-4xl px-6 py-14">
        <h2 className="text-center text-2xl font-bold md:text-3xl">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="mt-8">
          {item.faqs.map((f, idx) => (
            <AccordionItem key={idx} value={`f-${idx}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Related */}
      {item.related && item.related.length > 0 && (
        <section className="bg-secondary/40 py-14 border-t border-b">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-2xl font-bold md:text-3xl">You may also consider</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {item.related.map((slug) => {
                const rel = findCatalogItem(slug);
                if (!rel) return null;
                return (
                  <Link
                    key={slug}
                    to={rel.kind === "loan" ? "/loans/$slug" : "/insurance/$slug"}
                    params={{ slug: rel.slug }}
                    className="group overflow-hidden rounded-xl border bg-card transition hover:shadow-elevated"
                  >
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={rel.image}
                        alt={rel.name}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                        width={800}
                        height={450}
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold">{rel.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{rel.tagline}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-brand-gradient py-14 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-extrabold">Ready to move forward?</h2>
          <p className="mt-3 text-white/85">Submit your application in less than 3 minutes.</p>
          <div className="mt-6 flex justify-center">
            <ApplyDialog productName={item.name} productKind={item.kind}>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Apply for {item.name} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </ApplyDialog>
          </div>
        </div>
      </section>
    </div>
  );
}
