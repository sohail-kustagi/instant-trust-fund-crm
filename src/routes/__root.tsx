import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AppStoreProvider } from "@/lib/app-store";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  redirect,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";
import { AppLayout } from "@/components/app-layout";
import { DemoSwitcher } from "@/components/DemoSwitcher";
import { fetchAPI } from "@/lib/api";

import appCss from "../styles.css?url";
import { reportError } from "../lib/error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-surface px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-black text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-brand-navy"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-surface px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try again or head home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-brand-navy"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-md border px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: async ({ context, location }) => {
    const path = location.pathname;

    // List of routes and patterns that bypass auth checks
    const isPublic =
      path === "/" ||
      path === "/login" ||
      path === "/register" ||
      path === "/admin/login" ||
      path === "/assistant/login" ||
      path === "/privacy" ||
      path === "/terms" ||
      path === "/cibil" ||
      path === "/policybazaar" ||
      path === "/properties" ||
      path.startsWith("/loans") ||
      path.startsWith("/insurance");

    if (isPublic) {
      return;
    }

    let user: any = null;

    // Check client-side demo session
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("ify_demo_user");
        if (stored) {
          user = JSON.parse(stored);
        }
      } catch {
        user = null;
      }
    }

    if (!user) {
      try {
        user = await context.queryClient.ensureQueryData({
          queryKey: ["auth", "me"],
          queryFn: async () => {
            const data = await fetchAPI("/auth/me");
            return data?.user || null;
          },
          staleTime: 5 * 60 * 1000,
        });
      } catch {
        user = null;
      }
    }

    if (!user) {
      if (path.startsWith("/admin")) {
        throw redirect({ to: "/admin/login" });
      }
      if (path.startsWith("/assistant")) {
        throw redirect({ to: "/assistant/login" });
      }
      throw redirect({ to: "/login" });
    }

    // Role-based authorization
    if (path.startsWith("/admin")) {
      if (user.role !== "super_admin" && user.role !== "assistant_admin") {
        throw redirect({ to: "/admin/login" });
      }
    }

    if (path.startsWith("/assistant")) {
      if (user.role !== "assistant_admin" && user.role !== "super_admin") {
        throw redirect({ to: "/assistant/login" });
      }
    }

    // Customer route protection
    if (path.startsWith("/dashboard") || path.startsWith("/profile")) {
      if (user.role !== "customer") {
        if (user.role === "super_admin") {
          throw redirect({ to: "/admin" });
        }
        if (user.role === "assistant_admin") {
          throw redirect({ to: "/admin/tasks" });
        }
        throw redirect({ to: "/login" });
      }
    }
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Instant Funds for You — Loans, Insurance & Financial Advisory" },
      {
        name: "description",
        content:
          "Home, Business, Vehicle, Education, Personal & Gold Loans plus Health, Life, Motor, Travel & Family Insurance. Apply online in minutes.",
      },
      {
        property: "og:title",
        content: "Instant Funds for You — Loans, Insurance & Financial Advisory",
      },
      {
        property: "og:description",
        content:
          "Home, Business, Vehicle, Education, Personal & Gold Loans plus Health, Life, Motor, Travel & Family Insurance. Apply online in minutes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Instant Funds for You — Loans, Insurance & Financial Advisory",
      },
      {
        name: "twitter:description",
        content:
          "Home, Business, Vehicle, Education, Personal & Gold Loans plus Health, Life, Motor, Travel & Family Insurance. Apply online in minutes.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppStoreProvider>
            <AppLayout>
              <Outlet />
            </AppLayout>

            <DemoSwitcher />
            <Toaster richColors position="top-right" />
          </AppStoreProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );

}
