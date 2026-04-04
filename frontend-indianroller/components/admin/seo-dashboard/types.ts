import type { LucideIcon } from "lucide-react";

export type DashboardSection =
  | "dashboard"
  | "pages"
  | "editor"
  | "settings"
  | "sitemap"
  | "redirects"
  | "audit"
  | "roles";

export type PageStatus = "complete" | "incomplete";
export type RedirectType = "301" | "302";

export type SeoPage = {
  id: string;
  entityType?: string;
  name: string;
  url: string;
  status: PageStatus;
  indexed: boolean;
  metaAuthor?: string;
  metaPublisher?: string;
  metaLanguage?: string;
  metaRevisitAfter?: string;
  metaSubject?: string;
  metaClassification?: string;
  metaCoverage?: string;
  metaDistribution?: string;
  metaRating?: string;
  referrerPolicy?: string;
  themeColor?: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
  robots: string;
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterCard: string;
  schemaType?: string;
  schemaJson?: string;
  customHeadCode?: string;
  hreflangs?: Array<{ locale: string; url: string }>;
  additionalMetaTags?: Array<{
    name: string;
    property: string;
    httpEquiv: string;
    charset: string;
    content: string;
  }>;
  additionalLinkTags?: Array<{
    rel: string;
    href: string;
    hrefLang: string;
    media: string;
    type: string;
    title: string;
    sizes: string;
  }>;
  sitemapPriority?: number;
  sitemapChangefreq?: string;
  includeInSitemap?: boolean;
  isIndexed?: boolean;
  notes?: string;
  updatedAt: string;
};

export type GlobalSettings = {
  websiteName?: string;
  metaTitleFormat?: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  defaultKeywords: string;
  defaultMetaAuthor?: string;
  defaultMetaPublisher?: string;
  defaultMetaLanguage?: string;
  defaultRobots?: string;
  defaultThemeColor?: string;
  defaultOgImage?: string;
  defaultOgSiteName?: string;
  defaultOgLocale?: string;
  defaultTwitterSite?: string;
  defaultTwitterCreator?: string;
  faviconUrl?: string;
  appleTouchIconUrl?: string;
  manifestUrl?: string;
  googleAnalyticsId?: string;
  googleSearchConsoleCode?: string;
  bingWebmasterCode?: string;
  yandexVerificationCode?: string;
  pinterestVerificationCode?: string;
  baiduVerificationCode?: string;
  facebookPixelId?: string;
  robotsTxt?: string;
  htaccessRedirects?: string;
  siteUrl?: string;
  googleVerification: string;
  schemaType: string;
  organizationName: string;
  organizationUrl: string;
  robotsDefault: string;
  navbarProductDropdownLimit: number;
};

export type SitemapState = {
  lastGenerated: string;
  autoGenerate: boolean;
  xml: string;
};

export type RedirectRule = {
  id: string;
  from: string;
  to: string;
  type: RedirectType;
  hits: number;
};

export type RolePermission = {
  id: string;
  role: string;
  dashboard: boolean;
  pages: boolean;
  editor: boolean;
  settings: boolean;
  sitemap: boolean;
  redirects: boolean;
  audit: boolean;
};

export type AuditIssue = {
  id: string;
  pageName: string;
  url: string;
  type: "Missing Title" | "Duplicate Tags" | "Missing Description" | "Strong";
  message: string;
};

export type ToastItem = {
  id: number;
  title: string;
  description: string;
  tone?: "success" | "warning" | "info";
};

export type SummaryCardData = {
  id: string;
  title: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  accent: string;
};
