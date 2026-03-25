import BlogsPageClient from "@/components/blog/BlogsPageClient";
import { getSeoMetadataByPath } from "@/lib/seo";

export async function generateMetadata() {
  return getSeoMetadataByPath("/blogs", {
    // title: "Blogs | Indian Roller",
    // description: "Read blogs and industry updates from Indian Roller.",
  });
}

export default function BlogsPage() {
  return <BlogsPageClient />;
}
