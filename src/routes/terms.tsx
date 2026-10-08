import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Instant Funds for You" },
      {
        name: "description",
        content:
          "Terms and conditions governing your use of the Instant Funds for You financial services platform.",
      },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-14">
      <h1 className="text-3xl sm:text-4xl font-black text-brand-navy">Terms &amp; Conditions</h1>
      <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
        Last updated:{" "}
        {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
      </p>
      <div className="prose prose-slate mt-8 max-w-none space-y-4 text-sm text-muted-foreground">
        <p>
          <strong>1. Service scope.</strong> This platform facilitates financial-service requests
          such as loan applications, insurance enquiries, property verification, and CIBIL-report
          requests. The parties and processes involved may include the platform operator, partner
          lenders, insurers, and authorised verification providers.
        </p>
        <p>
          <strong>2. Website ownership.</strong> The platform is operated by the deploying entity
          and must comply with applicable regulatory approvals, including those required by the RBI,
          IRDAI, or other competent authorities.
        </p>
        <p>
          <strong>3. Use of information.</strong> Information entered into the platform is used
          solely to process your request and to fulfil legal, compliance, and service obligations.
          You should not submit any information that is not required for the relevant request.
        </p>
        <p>
          <strong>4. No advisory relationship.</strong> Product descriptions, rates, tenures,
          premiums, and eligibility criteria shown on this site are illustrative and may be subject
          to change. They do not constitute financial, tax, or investment advice, and do not create
          any advisor–client relationship unless expressly agreed in writing.
        </p>
        <p>
          <strong>5. Trademarks.</strong> Brand references to financial institutions or insurers are
          for informational purposes and do not imply endorsement unless expressly stated.
        </p>
        <p>
          <strong>6. Intellectual property.</strong> The platform content, branding, and code are
          owned by the operator unless otherwise noted. Redistribution requires the operator’s
          written consent.
        </p>
        <p>
          <strong>7. Limitation of liability.</strong> The platform operator is not liable for
          decisions taken by users based solely on information provided on the site, except where
          liability is imposed by law.
        </p>
        <p>
          <strong>8. Contact.</strong> Questions may be sent to <em>care@instantfunds.example</em>.
          Complaints related to regulated products should be directed to the relevant service
          provider or ombudsman authority.
        </p>
      </div>
    </div>
  ),
});
