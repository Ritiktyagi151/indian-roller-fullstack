const Blog = require("../models/Blog");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Redirect = require("../models/Redirect");
const SeoEntry = require("../models/SeoEntry");
const SeoSettings = require("../models/SeoSettings");

const staticPages = [
  {
    pageKey: "static:home",
    entityType: "static",
    entityId: "home",
    name: "Home",
    url: "/",
  },
  {
    pageKey: "static:about",
    entityType: "static",
    entityId: "about",
    name: "About",
    url: "/about",
  },
  {
    pageKey: "static:contact",
    entityType: "static",
    entityId: "contact",
    name: "Contact",
    url: "/contact",
  },
  {
    pageKey: "static:career",
    entityType: "static",
    entityId: "career",
    name: "Career",
    url: "/career",
  },
  {
    pageKey: "static:blogs",
    entityType: "static",
    entityId: "blogs",
    name: "Blogs",
    url: "/blogs",
  },
  {
    pageKey: "static:products",
    entityType: "static",
    entityId: "products",
    name: "Products",
    url: "/products",
  },
];

async function getSettings() {
  let settings = await SeoSettings.findOne();
  if (!settings) {
    settings = await SeoSettings.create({
      defaultMetaTitle: "Indian Roller | Industrial Rollers & Coatings",
      defaultMetaDescription:
        "Indian Roller manufactures industrial roller systems with dependable quality and support.",
      defaultKeywords: "industrial roller, rubber roller, polyurethane roller",
      websiteName: "Indian Roller",
      metaTitleFormat: "{Page Title} | {Site Name}",
      defaultMetaAuthor: "",
      defaultMetaPublisher: "",
      defaultMetaLanguage: "en",
      defaultRobots: "index,follow",
      defaultThemeColor: "",
      defaultOgImage: "",
      defaultOgSiteName: "Indian Roller",
      defaultOgLocale: "en_IN",
      defaultTwitterSite: "",
      defaultTwitterCreator: "",
      faviconUrl: "",
      appleTouchIconUrl: "",
      manifestUrl: "",
      googleAnalyticsId: "",
      googleSearchConsoleCode: "",
      bingWebmasterCode: "",
      yandexVerificationCode: "",
      pinterestVerificationCode: "",
      baiduVerificationCode: "",
      facebookPixelId: "",
      robotsTxt:
        "User-agent: *\nAllow: /\nSitemap: https://indianroller.com/sitemap.xml",
      htaccessRedirects: "",
      siteUrl: "https://indianroller.com",
      googleVerification: "",
      schemaType: "Organization",
      organizationName: "Indian Roller",
      organizationUrl: "https://indianroller.com",
      robotsDefault: "index, follow",
    });
  }
  return settings;
}

function createEntryMap(entries) {
  return new Map(entries.map((entry) => [entry.pageKey, entry]));
}

function buildStaticDefinition(page) {
  return {
    pageKey: page.pageKey,
    id: page.entityId,
    entityType: page.entityType,
    entityId: page.entityId,
    name: page.name,
    url: page.url,
    updatedAt: new Date().toISOString(),
    indexed: true,
  };
}

function buildBlogDefinition(blog) {
  return {
    pageKey: `blog:${blog._id}`,
    id: String(blog._id),
    entityType: "blog",
    entityId: String(blog._id),
    name: blog.title,
    url: `/blogs-${blog.slug}`,
    updatedAt: blog.updatedAt,
    indexed: true,
  };
}

function buildCategoryDefinition(category) {
  return {
    pageKey: `category:${category._id}`,
    id: String(category._id),
    entityType: "category",
    entityId: String(category._id),
    name: category.name,
    url: `/products-${category.slug}`,
    updatedAt: category.updatedAt,
    indexed: true,
  };
}

function buildProductDefinition(product) {
  return {
    pageKey: `product:${product._id}`,
    id: String(product._id),
    entityType: "product",
    entityId: String(product._id),
    name: product.name,
    url: `/${product.slug}`,
    updatedAt: product.updatedAt,
    indexed: true,
  };
}

function mergeSeo(definition, entry, settings) {
  const metaTitle =
    entry?.metaTitle ||
    (definition.entityType === "static"
      ? `${definition.name} | Indian Roller`
      : "");
  const metaDescription = entry?.metaDescription || "";
  const canonicalUrl =
    entry?.canonicalUrl ||
    `${settings.organizationUrl || "https://indianroller.com"}${definition.url}`;

  return {
    id: definition.id,
    entityType: definition.entityType,
    entityId: definition.entityId,
    pageKey: definition.pageKey,
    name: definition.name,
    url: definition.url,
    slug: definition.url === "/" ? "home" : definition.url.replace(/^\//, ""),
    status: metaTitle && metaDescription ? "complete" : "incomplete",
    indexed: entry?.robots
      ? !entry.robots.includes("noindex")
      : definition.indexed,
    metaTitle,
    metaDescription,
    keywords: entry?.metaKeywords || "",
    metaAuthor: entry?.metaAuthor || settings.defaultMetaAuthor || "",
    metaPublisher: entry?.metaPublisher || settings.defaultMetaPublisher || "",
    metaLanguage: entry?.metaLanguage || settings.defaultMetaLanguage || "en",
    metaRevisitAfter: entry?.metaRevisitAfter || "",
    metaSubject: entry?.metaSubject || "",
    metaClassification: entry?.metaClassification || "",
    metaCoverage: entry?.metaCoverage || "",
    metaDistribution: entry?.metaDistribution || "",
    metaRating: entry?.metaRating || "",
    referrerPolicy: entry?.referrerPolicy || "",
    themeColor: entry?.themeColor || settings.defaultThemeColor || "",
    canonicalUrl,
    robots: entry?.robots || settings.robotsDefault || "index, follow",
    openGraphTitle: entry?.openGraphTitle || metaTitle,
    openGraphDescription: entry?.openGraphDescription || metaDescription,
    openGraphImage: entry?.openGraphImage || settings.defaultOgImage || "",
    twitterTitle: entry?.twitterTitle || metaTitle,
    twitterDescription: entry?.twitterDescription || metaDescription,
    twitterCard: entry?.twitterCard || "summary_large_image",
    schemaType: entry?.schemaType || settings.schemaType || "Organization",
    schemaJson: entry?.schemaJson || "",
    customHeadCode: entry?.customHeadCode || "",
    hreflangs: entry?.hreflangs || [],
    additionalMetaTags: entry?.additionalMetaTags || [],
    additionalLinkTags: entry?.additionalLinkTags || [],
    sitemapPriority: entry?.sitemapPriority ?? 0.5,
    sitemapChangefreq: entry?.sitemapChangefreq || "weekly",
    includeInSitemap: entry?.includeInSitemap ?? true,
    isIndexed: entry?.isIndexed ?? definition.indexed,
    notes: entry?.notes || "",
    updatedAt: entry?.updatedAt || definition.updatedAt,
  };
}

async function getPageDefinitions() {
  const [blogs, categories, products] = await Promise.all([
    Blog.find().select("title slug updatedAt").sort({ updatedAt: -1 }),
    Category.find().select("name slug updatedAt").sort({ updatedAt: -1 }),
    Product.find().select("name slug updatedAt").sort({ updatedAt: -1 }),
  ]);

  return [
    ...staticPages.map(buildStaticDefinition),
    ...categories.map(buildCategoryDefinition),
    ...products.map(buildProductDefinition),
    ...blogs.map(buildBlogDefinition),
  ];
}

async function getMergedPages() {
  const settings = await getSettings();
  const [definitions, entries] = await Promise.all([
    getPageDefinitions(),
    SeoEntry.find().sort({ updatedAt: -1 }),
  ]);
  const entryMap = createEntryMap(entries);

  return {
    settings,
    pages: definitions.map((definition) =>
      mergeSeo(definition, entryMap.get(definition.pageKey), settings),
    ),
  };
}

async function resolveDefinition(entityType, id) {
  const definitions = await getPageDefinitions();
  return definitions.find(
    (definition) =>
      definition.entityType === entityType && definition.id === String(id),
  );
}

exports.getSeoPages = async (req, res) => {
  try {
    const { pages } = await getMergedPages();
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSeoPage = async (req, res) => {
  try {
    const { entityType, id } = req.params;
    const definition = await resolveDefinition(entityType, id);

    if (!definition) {
      return res.status(404).json({ message: "SEO page not found" });
    }

    const payload = {
      pageKey: definition.pageKey,
      entityType: definition.entityType,
      entityId: definition.entityId,
      pageName: definition.name,
      pageUrl: definition.url,
      metaTitle: req.body.metaTitle || "",
      metaDescription: req.body.metaDescription || "",
      metaKeywords: req.body.keywords || "",
      canonicalUrl: req.body.canonicalUrl || "",
      robots: req.body.robots || "index, follow",
      metaAuthor: req.body.metaAuthor || "",
      metaPublisher: req.body.metaPublisher || "",
      metaLanguage: req.body.metaLanguage || "en",
      metaRevisitAfter: req.body.metaRevisitAfter || "",
      metaSubject: req.body.metaSubject || "",
      metaClassification: req.body.metaClassification || "",
      metaCoverage: req.body.metaCoverage || "",
      metaDistribution: req.body.metaDistribution || "",
      metaRating: req.body.metaRating || "",
      referrerPolicy: req.body.referrerPolicy || "",
      themeColor: req.body.themeColor || "",
      openGraphTitle: req.body.openGraphTitle || "",
      openGraphDescription: req.body.openGraphDescription || "",
      openGraphImage: req.body.openGraphImage || "",
      twitterTitle: req.body.twitterTitle || "",
      twitterDescription: req.body.twitterDescription || "",
      twitterCard: req.body.twitterCard || "summary_large_image",
      schemaType: req.body.schemaType || "Organization",
      schemaJson: req.body.schemaJson || "",
      customHeadCode: req.body.customHeadCode || "",
      hreflangs: Array.isArray(req.body.hreflangs) ? req.body.hreflangs : [],
      additionalMetaTags: Array.isArray(req.body.additionalMetaTags)
        ? req.body.additionalMetaTags
        : [],
      additionalLinkTags: Array.isArray(req.body.additionalLinkTags)
        ? req.body.additionalLinkTags
        : [],
      sitemapPriority: Number.isFinite(Number(req.body.sitemapPriority))
        ? Number(req.body.sitemapPriority)
        : 0.5,
      sitemapChangefreq: req.body.sitemapChangefreq || "weekly",
      includeInSitemap: req.body.includeInSitemap !== false,
      isIndexed: req.body.isIndexed !== false,
      notes: req.body.notes || "",
    };

    const entry = await SeoEntry.findOneAndUpdate(
      { pageKey: definition.pageKey },
      payload,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      },
    );

    res.json(entry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteSeoPage = async (req, res) => {
  try {
    const { entityType, id } = req.params;
    const definition = await resolveDefinition(entityType, id);

    if (!definition) {
      return res.status(404).json({ message: "SEO page not found" });
    }

    await SeoEntry.findOneAndDelete({ pageKey: definition.pageKey });
    res.json({ message: "SEO entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSeoMetaByPath = async (req, res) => {
  try {
    const path = req.query.path;
    if (!path) {
      return res.status(400).json({ message: "path query is required" });
    }

    const normalizedPath = String(path).startsWith("/")
      ? String(path)
      : `/${String(path)}`;
    const { pages } = await getMergedPages();
    const page = pages.find((entry) => entry.url === normalizedPath);

    if (!page) {
      return res.status(404).json({ message: "SEO metadata not found" });
    }

    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSeoSettings = async (req, res) => {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSeoSettings = async (req, res) => {
  try {
    const settings = await getSettings();
    const updated = await SeoSettings.findByIdAndUpdate(
      settings._id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getRedirects = async (req, res) => {
  try {
    const redirects = await Redirect.find().sort({ createdAt: -1 });
    res.json(redirects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRedirect = async (req, res) => {
  try {
    const redirect = await Redirect.create(req.body);
    res.status(201).json(redirect);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteRedirect = async (req, res) => {
  try {
    const redirect = await Redirect.findByIdAndDelete(req.params.id);
    if (!redirect) {
      return res.status(404).json({ message: "Redirect not found" });
    }
    res.json({ message: "Redirect deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSitemap = async (req, res) => {
  try {
    const { settings, pages } = await getMergedPages();
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
      .map(
        (page) =>
          `  <url>\n    <loc>${settings.organizationUrl || "https://indianroller.com"}${page.url}</loc>\n    <lastmod>${new Date(page.updatedAt).toISOString()}</lastmod>\n  </url>`,
      )
      .join("\n")}\n</urlset>`;

    res.json({
      lastGenerated: new Date().toISOString(),
      autoGenerate: true,
      xml,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAudit = async (req, res) => {
  try {
    const { pages } = await getMergedPages();
    const issues = [];
    const titles = new Map();

    pages.forEach((page) => {
      if (!page.metaTitle) {
        issues.push({
          id: `${page.id}-missing-title`,
          pageName: page.name,
          url: page.url,
          type: "Missing Title",
          message: "Meta title is missing.",
        });
      }
      if (!page.metaDescription) {
        issues.push({
          id: `${page.id}-missing-description`,
          pageName: page.name,
          url: page.url,
          type: "Missing Description",
          message: "Meta description is missing.",
        });
      }
      if (page.metaTitle) {
        const normalized = page.metaTitle.toLowerCase();
        const existing = titles.get(normalized) || [];
        titles.set(normalized, [...existing, page]);
      }
    });

    titles.forEach((duplicates) => {
      if (duplicates.length > 1) {
        duplicates.forEach((page) => {
          issues.push({
            id: `${page.id}-duplicate`,
            pageName: page.name,
            url: page.url,
            type: "Duplicate Tags",
            message: "This page shares a duplicate meta title.",
          });
        });
      }
    });

    const score = Math.max(45, Math.round(100 - issues.length * 5));
    res.json({ score, issues });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
