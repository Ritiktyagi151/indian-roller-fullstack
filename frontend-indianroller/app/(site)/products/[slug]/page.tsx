import { redirect } from "next/navigation";

type RouteParams = {
  slug: string;
};

export default async function ProductSlugPage({ params }: { params: Promise<RouteParams> }) {
  const resolvedParams = await params;
  redirect(`/${resolvedParams.slug}`);
}
