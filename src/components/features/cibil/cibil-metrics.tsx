import React from "react";
import { Card } from "@/components/ui/card";
import { CreditCard, Percent, Layers, Landmark, HelpCircle } from "lucide-react";

interface CibilMetricsProps {
  metrics: {
    totalAccounts: number;
    creditUtilization: number;
    activeLoans: number;
    recentEnquiries: number;
  };
}

export function CibilMetrics({ metrics }: CibilMetricsProps) {
  const cards = [
    {
      title: "Total Accounts",
      value: metrics.totalAccounts,
      icon: CreditCard,
      description: "Credit cards & active/closed loans",
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Credit Utilization",
      value: `${metrics.creditUtilization}%`,
      icon: Percent,
      description: "Ratio of balance to credit limit",
      color: metrics.creditUtilization > 30 ? "text-amber-500 bg-amber-50 dark:bg-amber-950/30" : "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      title: "Active Loans",
      value: metrics.activeLoans,
      icon: Landmark,
      description: "Ongoing financial obligations",
      color: "text-purple-500 bg-purple-50 dark:bg-purple-950/30",
    },
    {
      title: "Recent Enquiries",
      value: metrics.recentEnquiries,
      icon: Layers,
      description: "Credit searches in last 30 days",
      color: metrics.recentEnquiries > 2 ? "text-rose-500 bg-rose-50 dark:bg-rose-950/30" : "text-teal-500 bg-teal-50 dark:bg-teal-950/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 w-full">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="p-3.5 sm:p-5 flex flex-col justify-between border bg-card hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-1.5 sm:p-2 rounded-xl ${card.color}`}>
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-xl sm:text-2xl font-black text-brand-navy dark:text-white tracking-tight">
                {card.value}
              </span>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-1 leading-normal font-medium">
                {card.description}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
