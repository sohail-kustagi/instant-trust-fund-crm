import { createFileRoute, notFound } from "@tanstack/react-router";
import { findInsurance } from "@/lib/catalog";
import { CategoryPage } from "@/components/category-page";

export const Route = createFileRoute("/insurance/$slug")({
  head: ({ params }) => {
    const item = params ? findInsurance(params.slug) : undefined;
    return {
      meta: [
        {
          title: item
            ? `${item.name} — Instant Funds for You`
            : "Insurance — Instant Funds for You",
        },
        { name: "description", content: item?.description ?? "Insurance plan details." },
        ...(item ? [{ property: "og:image" as const, content: item.image }] : []),
      ],
    };
  },
  loader: ({ params }) => {
    const item = findInsurance(params.slug);
    if (!item) throw notFound();
    return { item };
  },
  component: InsuranceDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl font-bold">Plan not found</h1>
    </div>
  ),
  errorComponent: () => <div className="p-24 text-center">Something went wrong</div>,
});

function InsuranceDetail() {
  const data = Route.useLoaderData() as { item: any } | undefined;
  const { slug } = Route.useParams();
  const item = data?.item ?? findInsurance(slug);
  return <CategoryPage item={item!} />;
}
