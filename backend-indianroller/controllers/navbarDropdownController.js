const Category = require("../models/Category");
const Product = require("../models/Product");
const NavbarDropdownSettings = require("../models/NavbarDropdownSettings");

const INDUSTRY_SLUGS = [
  "steel-industry",
  "textile-industry",
  "paper-and-packaging-industry",
  "food-industry",
  "plywood-industry",
  "rexene-industry",
  "cement-industry",
  "turnkey-project",
];

const DEFAULT_SECTIONS = [
  { key: "industry", title: "By Industry", displayType: "category" },
  { key: "material", title: "By Material", displayType: "category" },
];

function safeNumber(value, fallback = 0) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function normalizeItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  const seen = new Set();

  return items
    .map((item) => ({
      type: item?.type === "product" ? "product" : "category",
      refId: String(item?.refId || "").trim(),
      enabled: item?.enabled !== false,
      order: safeNumber(item?.order, 0),
      icon: String(item?.icon || "").trim(),
      categoryReference: String(item?.categoryReference || "").trim(),
    }))
    .filter((item) => {
      if (!item.refId) return false;
      const key = `${item.type}:${item.refId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function buildDefaultSections(categories) {
  const industryCategories = categories
    .filter((category) => INDUSTRY_SLUGS.includes(category.slug))
    .sort((a, b) => safeNumber(a.navbarOrder, 0) - safeNumber(b.navbarOrder, 0));
  const materialCategories = categories
    .filter((category) => !INDUSTRY_SLUGS.includes(category.slug))
    .sort((a, b) => safeNumber(a.navbarOrder, 0) - safeNumber(b.navbarOrder, 0));

  return [
    {
      key: "industry",
      title: "By Industry",
      displayType: "category",
      items: industryCategories.map((category, index) => ({
        type: "category",
        refId: String(category._id),
        enabled: true,
        order: index + 1,
        icon: "",
        categoryReference: "",
      })),
    },
    {
      key: "material",
      title: "By Material",
      displayType: "category",
      items: materialCategories.map((category, index) => ({
        type: "category",
        refId: String(category._id),
        enabled: true,
        order: index + 1,
        icon: "",
        categoryReference: "",
      })),
    },
  ];
}

function normalizeSections(sections, categories) {
  const defaults = buildDefaultSections(categories);

  return DEFAULT_SECTIONS.map((fallbackSection) => {
    const existing = Array.isArray(sections)
      ? sections.find((section) => section?.key === fallbackSection.key)
      : null;
    const defaultSection = defaults.find((section) => section.key === fallbackSection.key) || fallbackSection;

    return {
      key: fallbackSection.key,
      title: String(existing?.title || defaultSection.title || fallbackSection.title).trim(),
      displayType: existing?.displayType === "product" ? "product" : "category",
      items: normalizeItems(existing?.items?.length ? existing.items : defaultSection.items || []),
    };
  });
}

async function ensureSettings() {
  const categories = await Category.find().select("_id slug navbarOrder").sort({ navbarOrder: 1, createdAt: 1 });
  let settings = await NavbarDropdownSettings.findOne();

  if (!settings) {
    settings = await NavbarDropdownSettings.create({
      sections: buildDefaultSections(categories),
    });
    return settings;
  }

  const normalizedSections = normalizeSections(settings.sections, categories);
  const changed = JSON.stringify(settings.sections) !== JSON.stringify(normalizedSections);

  if (changed) {
    settings.sections = normalizedSections;
    await settings.save();
  }

  return settings;
}

async function loadResolvedData() {
  const settings = await ensureSettings();
  const [categories, products] = await Promise.all([
    Category.find().select("_id name slug description navbarOrder"),
    Product.find()
      .select("_id name slug category categories image")
      .populate("category", "_id name slug")
      .populate("categories", "_id name slug"),
  ]);

  const categoryMap = new Map(categories.map((category) => [String(category._id), category]));
  const productMap = new Map(products.map((product) => [String(product._id), product]));

  return { settings, categoryMap, productMap };
}

function deriveProductCategoryReference(product) {
  if (!product) return "";
  if (Array.isArray(product.categories) && product.categories.length > 0) {
    const primary = product.categories[0];
    return typeof primary === "string" ? primary : primary?.slug || primary?.name || "";
  }
  if (product.category && typeof product.category !== "string") {
    return product.category.slug || product.category.name || "";
  }
  return typeof product.category === "string" ? product.category : "";
}

exports.getNavbarDropdownSettings = async (req, res) => {
  try {
    const settings = await ensureSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateNavbarDropdownSettings = async (req, res) => {
  try {
    const categories = await Category.find().select("_id slug navbarOrder").sort({ navbarOrder: 1, createdAt: 1 });
    const settings = await ensureSettings();
    const sections = normalizeSections(req.body?.sections, categories);

    settings.sections = sections;
    await settings.save();

    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getNavbarDropdownData = async (req, res) => {
  try {
    const { settings, categoryMap, productMap } = await loadResolvedData();

    const sections = (settings.sections || []).map((section) => {
      const items = (section.items || [])
        .filter((item) => item.type === section.displayType && item.enabled)
        .sort((a, b) => safeNumber(a.order, 0) - safeNumber(b.order, 0))
        .map((item) => {
          if (item.type === "category") {
            const category = categoryMap.get(item.refId);
            if (!category) return null;
            return {
              type: "category",
              refId: item.refId,
              name: category.name,
              slug: category.slug,
              order: safeNumber(item.order, 0),
              enabled: item.enabled,
              icon: item.icon || "",
              categoryReference: "",
              href: `/products/${category.slug}`,
            };
          }

          const product = productMap.get(item.refId);
          if (!product) return null;
          return {
            type: "product",
            refId: item.refId,
            name: product.name,
            slug: product.slug,
            order: safeNumber(item.order, 0),
            enabled: item.enabled,
            icon: item.icon || "",
            categoryReference: item.categoryReference || deriveProductCategoryReference(product),
            href: `/products/${product.slug}`,
          };
        })
        .filter(Boolean);

      return {
        key: section.key,
        title: section.title,
        displayType: section.displayType,
        items,
      };
    });

    res.json({ sections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
