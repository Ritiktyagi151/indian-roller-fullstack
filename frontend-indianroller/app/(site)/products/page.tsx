import ProductsPageClient from "@/components/products/ProductsPageClient";
import { getSeoMetadataByPath } from "@/lib/seo";

export async function generateMetadata() {
  return getSeoMetadataByPath("/products", {
    // title: "Products | Indian Roller",
    // description: "Browse industrial roller product categories from Indian Roller.",
  });
}

export default function ProductsPage() {
  return <ProductsPageClient />;
}
