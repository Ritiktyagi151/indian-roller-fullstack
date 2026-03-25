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

  let productData = null;
  try {
    const productRes = await axios.get(`${API_URL}/products/slug/${fullPath}`);
    productData = productRes.data;
  } catch {}

  if (productData) {
    return <ProductDetailClient product={productData} />;
  }

  if (fullPath.startsWith('products-')) {
    const identifier = fullPath.replace('products-', '');
    let productsData = null;

    try {
      const productsRes = await axios.get(`${API_URL}/products/category/${identifier}`);
      productsData = productsRes.data;
    } catch {
      return notFound();
    }

    return <ProductListingClient categorySlug={identifier} initialProducts={productsData} />;
  }

  return notFound();
}
