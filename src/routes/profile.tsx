import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { useAuth, type User } from "@/lib/auth-context";
import { fetchAPI } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, CreditCard, Sparkles, ShieldCheck, Clock, LogOut } from "lucide-react";

interface ApplicationItem {
  _id: string;
  productType: string;
  status: string;
}

interface ActivityItem {
  message: string;
  timestamp: string;
}

type ApplicationsResponse = {
  applications: ApplicationItem[];
};

type ActivityResponse = {
  items: ActivityItem[];
};

interface UpdateProfileResponse {
  user?: User;
}

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "My Profile — IFY CRM" }] }),
  component: ProfileGuard,
});

function ProfileGuard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center p-12">Loading secure session...</div>;
  }

  if (!user || user.role !== "customer") {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-rose-600">Access Restricted</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You must be signed in as a customer to view your profile.
        </p>
      </div>
    );
  }

  return <ProfilePage />;
}

function ProfilePage() {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const [fullName, setFullName] = useState(user.fullName ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [mobile, setMobile] = useState(user.mobile ?? "");
  const [dob, setDob] = useState(user.dob ?? "");

  const { data: applicationsData, isLoading: appsLoading } = useQuery<ApplicationsResponse>({
    queryKey: ["my-applications"],
    queryFn: () => fetchAPI("/applications/"),
    staleTime: 1000 * 60,
  });

  const { data: activityData } = useQuery<ActivityResponse>({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      return await fetchAPI("/activity/recent").catch(() => ({ items: [] }));
    },
    staleTime: 1000 * 60 * 5,
  });

  const updateProfileMutation = useMutation<
    UpdateProfileResponse,
    unknown,
    { fullName: string; email: string; mobile: string; dob: string }
  >({
    mutationFn: async (payload: { fullName: string; email: string; mobile: string; dob: string }) => {
      return await fetchAPI("/auth/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (data) => {
      if (data?.user) {
        login(data.user);
      }
      toast.success("Profile updated successfully.");
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Failed to update profile.");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    updateProfileMutation.mutate({
      fullName: fullName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      dob: dob.trim(),
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/login" });
  };

  const suggestedOffers = useMemo(
    () => [
      {
        title: "Personal Loan with 12.99% APR",
        subtitle: "Instant approval in 24 hours",
        Icon: CreditCard,
      },
      {
        title: "Health Insurance Plan",
        subtitle: "Cover your family with affordable premiums",
        Icon: ShieldCheck,
      },
      {
        title: "Top-up Credit Offer",
        subtitle: "Access extra funds on your existing loan",
        Icon: Sparkles,
      },
    ],
    [],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-primary">Customer Profile</p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-brand-navy">Welcome back, {user.fullName}</h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl">
            Manage your personal details, review applications, and explore offers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2 text-xs">
            <LogOut className="h-3.5 w-3.5" /> Logout
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-6">
          <Card className="p-4 sm:p-6 border shadow-sm">
            <div className="mb-5 sm:mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-brand-navy">Personal Details</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Update your contact and DOB details here.</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
                {user.role === "customer" ? "Customer" : "User"}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-xs sm:text-sm">Full Name</Label>
                <Input id="fullName" value={fullName} onChange={(event) => setFullName(event.target.value)} required className="text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
                <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-xs sm:text-sm">Mobile Number</Label>
                <Input id="mobile" type="tel" value={mobile} onChange={(event) => setMobile(event.target.value)} className="text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-xs sm:text-sm">Date of Birth</Label>
                <Input id="dob" type="date" value={dob} onChange={(event) => setDob(event.target.value)} className="text-sm" />
              </div>

              <div className="sm:col-span-2">
                <Button type="submit" className="flex w-full items-center justify-center gap-2 h-11" disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending ? "Saving..." : "Save changes"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </Card>

          <Card className="p-4 sm:p-6 border shadow-sm">
            <div className="mb-4 sm:mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-brand-navy">Your Applications</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Track current loans and insurance requests.</p>
              </div>
            </div>

            {appsLoading ? (
              <p className="text-sm text-muted-foreground">Loading applications...</p>
            ) : applicationsData?.applications?.length ? (
              <div className="space-y-3">
                {applicationsData.applications.map((application: ApplicationItem) => (
                  <div key={application._id} className="rounded-xl border border-border/80 bg-slate-50 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-brand-navy capitalize">{application.productType}</p>
                        <p className="text-xs text-muted-foreground">Reference ID: {application._id}</p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{application.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/80 bg-slate-50 p-8 text-center">
                <p className="text-sm text-muted-foreground">You have no active applications at the moment.</p>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 border shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-brand-navy">Recent Activity</h2>
              <p className="text-sm text-muted-foreground">Latest actions from your account.</p>
            </div>
            <div className="space-y-4">
              {activityData?.items?.length ? (
                activityData.items.map((item: ActivityItem, index: number) => (
                  <div key={index} className="rounded-xl border border-border/80 p-4 bg-white">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{item.message}</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{item.timestamp}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border/80 bg-slate-50 p-8 text-center">
                  <p className="text-sm text-muted-foreground">No recent activity yet.</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 border shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-brand-navy">Suggested Offers</h2>
              <p className="text-sm text-muted-foreground">Recommended products based on your profile.</p>
            </div>
            <div className="space-y-3">
              {suggestedOffers.map((offer) => (
                <div key={offer.title} className="flex items-start gap-3 rounded-xl border border-border/80 bg-white p-4">
                  <offer.Icon className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold text-brand-navy">{offer.title}</p>
                    <p className="text-sm text-muted-foreground">{offer.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-xl border border-border/80 bg-emerald-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 text-emerald-900">
              <CheckCircle2 className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Fast support available</h3>
                <p className="text-sm">Our team is here to help with your application and documentation.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}