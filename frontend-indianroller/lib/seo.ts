import type { Metadata } from "next";

type SeoResponse = {
  name?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonicalUrl?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterCard?: string;
};

export async function getSeoMetadataByPath(
  path: string,
  fallback: Metadata,
): Promise<Metadata> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return fallback;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  try {
    const response = await fetch(
      `${apiUrl}/seo/meta?path=${encodeURIComponent(normalizedPath)}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      return fallback;
    }

    const seo = (await response.json()) as SeoResponse;

    return {
      title: seo.metaTitle || fallback.title,
      description: seo.metaDescription || fallback.description,
      keywords: seo.keywords || fallback.keywords,
      alternates: {
        canonical: seo.canonicalUrl || normalizedPath,
      },
      openGraph: {
        title: seo.openGraphTitle || seo.metaTitle || String(fallback.title || ""),
        description:
          seo.openGraphDescription ||
          seo.metaDescription ||
          String(fallback.description || ""),
        images: seo.openGraphImage ? [seo.openGraphImage] : undefined,
      },
      twitter: {
        title: seo.twitterTitle || seo.metaTitle || String(fallback.title || ""),
        description:
          seo.twitterDescription ||
          seo.metaDescription ||
          String(fallback.description || ""),
        card: (seo.twitterCard as "summary" | "summary_large_image") || "summary_large_image",
      },
    };
  } catch {
    return fallback;
  }
}
