import axios from "axios";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import ProductListingClient from "@/components/products/ProductListingClient";
import { getSeoMetadataByPath } from "@/lib/seo";

type RouteParams = {
  slug: string;
};

type CategoryRecord = {
  _id: string;
  name: string;
  slug: string;
};

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const resolvedParams = await params;
  return getSeoMetadataByPath(`/products/${resolvedParams.slug}`, {
    title: "Products | Indian Roller",
    description: "Explore categories and products from Indian Roller.",
  });
}

export default async function ProductSlugPage({ params }: { params: Promise<RouteParams> }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!slug || !apiUrl) {
    return notFound();
  }

  let categories: CategoryRecord[] = [];
  try {
    const categoriesRes = await axios.get(`${apiUrl}/categories`);
    categories = Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
  } catch (error) {
    console.error("Category lookup error:", error);
  }

  const matchedCategory = categories.find((category) => category.slug === slug);

  if (matchedCategory) {
    try {
      const productsRes = await axios.get(`${apiUrl}/products/category/${slug}`);
      const products = Array.isArray(productsRes.data) ? productsRes.data : [];
      return <ProductListingClient categorySlug={slug} initialProducts={products} />;
    } catch (error) {
      console.error("Category products fetch error:", error);
      return notFound();
    }
  }

  try {
    const productRes = await axios.get(`${apiUrl}/products/slug/${slug}`);
    if (productRes.data) {
      return <ProductDetailClient product={productRes.data} />;
    }
  } catch (error) {
    console.error("Product fetch error:", error);
  }

  return notFound();
}
