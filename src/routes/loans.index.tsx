import { createFileRoute, Link } from "@tanstack/react-router";
import { loans } from "@/lib/catalog";

export const Route = createFileRoute("/loans/")({
  head: () => ({
    meta: [
      { title: "Loans — Instant Funds for You" },
      {
        name: "description",
        content:
          "Explore Home, Vehicle, Business, Education, Personal, Property and Mortgage loans with instant approvals and competitive rates.",
      },
    ],
  }),
  component: LoansIndex,
});

function LoansIndex() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-14">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-3xl font-black sm:text-4xl md:text-5xl">All Loan Products</h1>
        <p className="mt-2 sm:mt-3 max-w-2xl text-xs sm:text-sm text-muted-foreground">
          From your first home to your growing business — pick a loan tailored to your goal, apply
          online in minutes, and get funds fast.
        </p>
      </div>
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loans.map((l) => (
          <Link
            key={l.slug}
            to="/loans/$slug"
            params={{ slug: l.slug }}
            className="group overflow-hidden rounded-xl sm:rounded-2xl border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-elevated"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={l.image}
                alt={l.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                width={800}
                height={500}
                loading="lazy"
              />
            </div>
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold">{l.name}</h3>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">{l.tagline}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="rounded-full bg-sbi-blue px-3 py-1 font-semibold text-white">
                  {l.rate}
                </span>
                <span className="font-semibold text-primary group-hover:underline">
                  Learn more →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
