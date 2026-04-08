import { notFound } from "next/navigation";
import axios from "axios";
import type { Metadata } from "next";
import ProductListingClient from "@/components/products/ProductListingClient";
import { getSeoMetadataByPath } from "@/lib/seo";

type CategoryRouteParam = {
  category: string;
};

export async function generateMetadata({ params }: { params: Promise<CategoryRouteParam> }): Promise<Metadata> {
  const resolvedParams = await params;
  const fullSlug = `products-${resolvedParams.category}`;

  return getSeoMetadataByPath(`/${fullSlug}`, {
    title: "Indian Roller | Premium Industrial Solutions",
    description: "Industrial rollers, coatings, and engineered solutions from Indian Roller.",
  });
}

export default async function CategoryListingPage({ params }: { params: Promise<CategoryRouteParam> }) {
  const resolvedParams = await params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!API_URL) {
    return notFound();
  }

  const fullSlug = `products-${resolvedParams.category}`;
  const [productResult, categoryResult] = await Promise.allSettled([
    axios.get(`${API_URL}/products/category/${fullSlug}`),
    axios.get(`${API_URL}/categories/slug/${fullSlug}`),
  ]);

  const productData =
    productResult.status === "fulfilled" ? productResult.value.data : null;
  const categoryData =
    categoryResult.status === "fulfilled" ? categoryResult.value.data : null;

  if (categoryData) {
    return <ProductListingClient categorySlug={fullSlug} initialProducts={Array.isArray(productData) ? productData : []} category={categoryData} />;
  }

  return notFound();
}
