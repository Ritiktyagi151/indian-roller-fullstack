"use client";

import { useSearchParams } from "next/navigation";
import ProductsManager from "@/components/admin/panel/ProductsManager";

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tab =
    tabParam === "categories" || tabParam === "products" || tabParam === "add"
      ? tabParam
      : "products";

  return <ProductsManager initialTab={tab} />;
}
