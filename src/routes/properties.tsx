import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DEMO_PROPERTIES } from "@/lib/demo-data";
import PropertyMap from "@/components/PropertyMap";
import { toast } from "sonner";
import {
  Building2,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Search,
  ArrowRight,
  Landmark,
  FileCheck,
} from "lucide-react";

export const Route = createFileRoute("/properties")({
  head: () => ({
    meta: [
      { title: "Verified Properties & Land Parcels — Instant Trust Funds" },
      {
        name: "description",
        content:
          "Browse KGIS and Bhoomi verified commercial, residential, and agricultural land parcels with pre-approved Loan Against Property (LAP) eligibility.",
      },
    ],
  }),
  component: PropertiesList,
});

function PropertiesList() {
  const [search, setSearch] = useState("");
  const [selectedProp, setSelectedProp] = useState<any | null>(null);

  const { data } = useQuery({
    queryKey: ["verified-properties"],
    queryFn: () => fetchAPI("/properties"),
    initialData: { properties: DEMO_PROPERTIES },
  });

  const properties = data?.properties || DEMO_PROPERTIES;

  const filtered = properties.filter(
    (p: any) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.surveyNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.district.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-brand-navy">Verified Property Portfolio</h1>
            <Badge className="bg-emerald-500/10 text-emerald-600 font-semibold text-xs">
              KGIS & Bhoomi Audited
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Explore audited land parcels, commercial real estate, and high-value loan against property assets.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search survey no, city, or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Cadastral GIS Map */}
      <Card className="p-3 sm:p-4 border shadow-sm mb-6 sm:mb-10 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 px-1 sm:px-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-brand-navy flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              Karnataka GIS Cadastral Land Parcel Map
            </h2>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
              Official revenue boundary and survey number GIS pins. Click any pin to inspect details.
            </p>
          </div>
          <Badge variant="outline" className="text-[11px] font-medium self-start sm:self-auto shrink-0">
            OpenStreetMap + KGIS WMS
          </Badge>
        </div>

        <div className="h-[280px] sm:h-[380px] w-full rounded-xl overflow-hidden border">
          <PropertyMap
            properties={filtered}
            onSelectProperty={(prop) => {
              setSelectedProp(prop);
              toast.info(`Selected ${prop.surveyNumber || "parcel"}`);
            }}
          />
        </div>
      </Card>

      {/* Property Cards Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        {filtered.map((prop: any) => (
          <Card
            key={prop.id}
            className="p-4 sm:p-6 border bg-card shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant="outline" className="text-xs font-semibold text-primary border-primary/30 mb-2">
                    {prop.surveyNumber}
                  </Badge>
                  <h3 className="text-lg font-bold text-brand-navy">{prop.title}</h3>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 font-semibold shrink-0">
                  <CheckCircle2 className="h-3 w-3 mr-1 inline" />
                  {prop.status}
                </Badge>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>
                  {prop.village}, {prop.taluk}, {prop.district}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <span className="text-[11px] uppercase font-bold text-slate-500">Market Value</span>
                  <div className="text-base font-black text-brand-navy mt-0.5">{prop.marketValue}</div>
                </div>
                <div className="bg-primary/5 p-3 rounded-lg">
                  <span className="text-[11px] uppercase font-bold text-primary">LAP Loan Limit</span>
                  <div className="text-base font-black text-primary mt-0.5">{prop.loanEligibility}</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {prop.features?.map((f: string, i: number) => (
                  <span
                    key={i}
                    className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium"
                  >
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Owner: {prop.ownerName}</span>
              <Button
                size="sm"
                onClick={() =>
                  toast.success(
                    `Inquiry registered for ${prop.surveyNumber}. Loan executive will contact you.`,
                  )
                }
                className="bg-primary hover:bg-brand-navy flex items-center gap-1.5 text-xs"
              >
                Apply for Loan <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
