import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Instant Funds for You" },
      {
        name: "description",
        content:
          "How we handle information on the Instant Funds for You financial services platform.",
      },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-14">
      <h1 className="text-3xl sm:text-4xl font-black text-brand-navy">Privacy Policy</h1>
      <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
        Last updated:{" "}
        {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
      </p>
      <div className="mt-8 space-y-4 text-sm text-muted-foreground">
        <p>
          <strong>1. Data processing.</strong> The platform processes personal and financial
          information strictly for the purpose of evaluating and servicing your requested loan,
          insurance, or verification request through authorised partner institutions.
        </p>
        <p>
          <strong>2. What we collect.</strong> We may collect your name, contact details, PAN,
          Aadhaar, employment/income details, and uploaded KYC documents where necessary to process
          your application and comply with regulatory obligations.
        </p>
        <p>
          <strong>3. Security.</strong> The production deployment uses encrypted transport and
          secure server-side storage, role-based access controls, and audit logging to safeguard
          sensitive information.
        </p>
        <p>
          <strong>4. Cookies and analytics.</strong> The platform may use essential session and
          preference cookies. Marketing and third-party analytics are not used without explicit
          consent.
        </p>
        <p>
          <strong>5. Your rights.</strong> Under applicable data-protection law you may request
          access, correction, or deletion of personal data held by the platform, subject to legal
          and regulatory retention requirements.
        </p>
        <p>
          <strong>6. Grievances.</strong> Questions about your data or service may be sent to{" "}
          <em>care@instantfunds.example</em>. For regulated complaints, you may also contact the
          relevant bank, insurer, or ombudsman authority.
        </p>
        <p>
          <strong>7. Updates.</strong> This policy may be revised at any time; the updated date at
          the top of this page reflects the latest version.
        </p>
      </div>
    </div>
  ),
});
