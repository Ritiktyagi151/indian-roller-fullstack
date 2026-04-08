import { notFound } from 'next/navigation';
import axios from "axios";
import { Metadata } from 'next';
import BlogContent from '@/components/blog/BlogContent';
import Sidebar from '@/components/blog/Sidebar';
import ProductDetailClient from '../../../components/products/ProductDetailClient';
import ProductListingClient from '../../../components/products/ProductListingClient';
import "../../globals.css";
import { getSeoMetadataByPath } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug.length === 0) {
    return {
      title: "Indian Roller | Premium Industrial Solutions",
      description: "Industrial rollers, coatings, and engineered solutions from Indian Roller.",
    };
  }
  const fullPath = slug[0];

  return getSeoMetadataByPath(`/${fullPath}`, {
    title: "Indian Roller | Premium Industrial Solutions",
    description: "Industrial rollers, coatings, and engineered solutions from Indian Roller.",
  });
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  if (!slug || slug.length === 0) return notFound();

  const fullPath = slug[0];
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!API_URL) {
    return notFound();
  }

  if (slug.length > 1) {
    return notFound();
  }

  if (fullPath.startsWith('blogs-')) {
    const actualSlug = fullPath.replace('blogs-', '');
    let blogData = null;

    try {
      const res = await axios.get(`${API_URL}/blogs/slug/${actualSlug}`);
      blogData = res.data;
    } catch (err) {
      console.error("Blog Fetch Error:", err);
      return notFound();
    }

    if (!blogData) return notFound();

    return (
      <div className="bg-black min-h-screen pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 mt-10">
            <div className="w-full lg:w-[68%]">
              <BlogContent data={blogData} />
            </div>
            <aside className="w-full lg:w-[32%] sticky top-28 h-fit">
              <Sidebar currentBlog={blogData} />
            </aside>
          </div>
        </div>
      </div>
    );
  }

  const [productResult, categoryResult, categoryProductsResult] = await Promise.allSettled([
    axios.get(`${API_URL}/products/slug/${fullPath}`),
    axios.get(`${API_URL}/categories/slug/${fullPath}`),
    axios.get(`${API_URL}/products/category/${fullPath}`),
  ]);

  const productData =
    productResult.status === "fulfilled" ? productResult.value.data : null;
  const categoryData =
    categoryResult.status === "fulfilled" ? categoryResult.value.data : null;
  const categoryProducts =
    categoryProductsResult.status === "fulfilled" ? categoryProductsResult.value.data : [];

  const hasProductMatch = Boolean(productData);
  const hasCategoryMatch = Boolean(categoryData);

  if (hasProductMatch && hasCategoryMatch) {
    console.error(`Slug conflict detected for "${fullPath}" between product and category.`);
    return notFound();
  }

  if (hasCategoryMatch) {
    return <ProductListingClient categorySlug={fullPath} initialProducts={Array.isArray(categoryProducts) ? categoryProducts : []} category={categoryData} />;
  }

  if (hasProductMatch) {
    return <ProductDetailClient product={productData} />;
  }

  return notFound();
}
