import axios from "axios";
import ProductCard from "@/components/products/ProductCard";
import { notFound } from 'next/navigation';
import { getSeoMetadataByPath } from "@/lib/seo";

type CategoryRouteParam = {
  category: string;
};

type CategoryRecord = {
  slug: string;
};

type ProductRecord = {
  _id: string;
  slug?: string;
  name: string;
  image?: string;
  industry?: string;
  shortDescription?: string;
  shortDesc?: string;
  category?: { name?: string } | null;
};

export async function generateStaticParams() {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
    const categories = res.data as CategoryRecord[];

    return categories.map((cat) => ({
      category: cat.slug,
    }));
  } catch (error) {
    console.error("Static params fetch error:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<CategoryRouteParam> }) {
  const resolvedParams = await params;
  return getSeoMetadataByPath(`/products-${resolvedParams.category}`, {
    title: "Product Category | Indian Roller",
    description: "Explore industrial roller product categories from Indian Roller.",
  });
}

export default async function CategoryListingPage({ params }: { params: Promise<CategoryRouteParam> }) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams?.category;

  if (!categorySlug) {
    return notFound();
  }

  const decodedCategory = categorySlug ? categorySlug.replace(/-/g, ' ') : "";
  let products: ProductRecord[] = [];
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/category/${categorySlug}`);
    products = res.data as ProductRecord[];
  } catch (error) {
    console.error("Fetch error:", error);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0b] pt-32 pb-20 px-6 text-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 border-l-4 border-orange-500 pl-8">
            <p className="text-orange-500 font-black tracking-[0.4em] uppercase text-[10px] mb-2 italic">
              Premium Solutions
            </p>
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.8]">
              {decodedCategory} <br />
              
            </h1>
        </header>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-sm">
            <p className="text-gray-600 uppercase font-black tracking-[0.2em] italic text-xl">
              No products found in <span className="text-orange-500">{decodedCategory}</span>
            </p>
            <p className="text-gray-700 mt-2 text-sm font-bold uppercase">
              We are updating our inventory. Please contact us for custom requirements.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
