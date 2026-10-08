import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEMO_NOTIFICATIONS } from "@/lib/demo-data";
import { toast } from "sonner";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageSquare,
  ShieldCheck,
  Check,
  Clock,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({ meta: [{ title: "System Notifications — IFY CRM" }] }),
  component: AdminNotifications,
});

function AdminNotifications() {
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);

  const { data } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: () => fetchAPI("/notifications"),
    initialData: { notifications: DEMO_NOTIFICATIONS },
  });

  const list: any[] = notifications.length > 0 ? notifications : (data?.notifications || DEMO_NOTIFICATIONS);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success("All notifications marked as read");
  };

  const unreadCount = list.filter((n: any) => n.unread).length;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-brand-navy">System Notifications</h1>
            {unreadCount > 0 && (
              <Badge className="bg-primary text-white font-bold text-xs">{unreadCount} New</Badge>
            )}
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Automated alerts, loan sanction notifications, and DLT SMS delivery reports.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 text-xs font-semibold h-8"
          >
            <Check className="h-3.5 w-3.5" /> Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {list.map((item: any) => {
          const isUnread = item.unread;
          return (
            <Card
              key={item.id}
              className={`p-4 sm:p-5 border transition hover:shadow-sm ${
                isUnread ? "bg-primary/5 border-primary/30" : "bg-card"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`rounded-xl p-2.5 mt-0.5 ${
                    item.tone === "success"
                      ? "bg-emerald-100 text-emerald-600"
                      : item.tone === "info"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.tone === "success" ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : item.tone === "info" ? (
                    <FileText className="h-5 w-5" />
                  ) : (
                    <Bell className="h-5 w-5" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-brand-navy">{item.title}</h3>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
