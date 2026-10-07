import { createFileRoute, notFound } from "@tanstack/react-router";
import { findLoan } from "@/lib/catalog";
import { CategoryPage } from "@/components/category-page";

export const Route = createFileRoute("/loans/$slug")({
  head: ({ params }) => {
    const item = params ? findLoan(params.slug) : undefined;
    return {
      meta: [
        { title: item ? `${item.name} — Instant Funds for You` : "Loan — Instant Funds for You" },
        {
          name: "description",
          content: item?.description ?? "Loan product details and application.",
        },
        ...(item ? [{ property: "og:image" as const, content: item.image }] : []),
      ],
    };
  },
  loader: ({ params }) => {
    const item = findLoan(params.slug);
    if (!item) throw notFound();
    return { item };
  },
  component: LoanDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl font-bold">Loan not found</h1>
      <p className="mt-2 text-muted-foreground">Please pick a loan from our catalog.</p>
    </div>
  ),
  errorComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
    </div>
  ),
});

function LoanDetail() {
  const data = Route.useLoaderData() as { item: any } | undefined;
  const { slug } = Route.useParams();
  const item = data?.item ?? findLoan(slug);
  return <CategoryPage item={item!} />;
}
