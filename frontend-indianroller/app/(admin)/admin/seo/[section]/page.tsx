import ApiSeoPanel from "@/components/admin/seo-dashboard/ApiSeoPanel";
import type { DashboardSection } from "@/components/admin/seo-dashboard/types";

const allowedSections: DashboardSection[] = [
  "dashboard",
  "pages",
  "editor",
  "settings",
  "sitemap",
  "redirects",
  "audit",
];

type Props = {
  params: Promise<{ section: string }>;
};

export default async function SeoSectionPage({ params }: Props) {
  const resolved = await params;
  const section = allowedSections.includes(resolved.section as DashboardSection)
    ? (resolved.section as DashboardSection)
    : "dashboard";

  return <ApiSeoPanel initialSection={section} />;
}
