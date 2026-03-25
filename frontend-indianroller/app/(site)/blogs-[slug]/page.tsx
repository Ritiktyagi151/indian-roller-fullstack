import { notFound } from 'next/navigation';
import BlogContent from '@/components/blog/BlogContent';
import Sidebar from '@/components/blog/Sidebar';
import axios from "axios";
import { getSeoMetadataByPath } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return getSeoMetadataByPath(`/blogs-${slug}`, {
    // title: "Blog Post | Indian Roller",
    // description: "Read the latest industrial roller insights from Indian Roller.",
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let blog;

  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blogs/slug/${slug}`);
    blog = res.data;
  } catch {
    return notFound();
  }

  return (
    <div className="bg-black min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 mt-10">
          <div className="w-full lg:w-[68%]">
            <BlogContent data={blog} />
          </div>
          <aside className="w-full lg:w-[32%] sticky top-28 h-fit">
            <Sidebar currentBlog={blog} />
          </aside>
        </div>
      </div>
    </div>
  );
}
