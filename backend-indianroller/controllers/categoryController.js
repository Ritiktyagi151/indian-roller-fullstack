const Category = require("../models/Category");
const Product = require("../models/Product");
const slugify = require("slugify");

function normalizeManualSlug(slug) {
  return String(slug || "").trim().replace(/^\/+|\/+$/g, "");
}

function resolveCategorySlug(slug, name) {
  const manualSlug = normalizeManualSlug(slug);
  if (manualSlug) {
    return manualSlug;
  }

  return slugify(String(name || "").trim(), { lower: true, strict: true });
}

function isValidSlug(slug) {
  return /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/.test(slug);
}

async function ensureSlugAvailable(slug, categoryId) {
  const categoryConflict = await Category.findOne({
    slug,
    ...(categoryId ? { _id: { $ne: categoryId } } : {}),
  }).select("_id");

  if (categoryConflict) {
    throw new Error("This slug is already in use by another category.");
  }

  const productConflict = await Product.findOne({ slug }).select("_id");
  if (productConflict) {
    throw new Error("This slug is already in use by a product.");
  }
}

exports.createCategory = async (req, res) => {
  try {
    const { name, description, navbarOrder, slug } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const lastCategory = await Category.findOne().sort({ navbarOrder: -1, createdAt: -1 });
    const nextOrder = Number.isFinite(Number(navbarOrder))
      ? Number(navbarOrder)
      : (lastCategory?.navbarOrder ?? -1) + 1;

    const resolvedSlug = resolveCategorySlug(slug, name);
    if (!resolvedSlug || !isValidSlug(resolvedSlug)) {
      return res.status(400).json({
        message: "Slug must use only letters, numbers, and single hyphens.",
      });
    }

    await ensureSlugAvailable(resolvedSlug);

    const data = {
      name,
      description,
      slug: resolvedSlug,
      navbarOrder: nextOrder,
    };

    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }

    const category = await Category.create(data);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .select("name slug image description navbarOrder createdAt updatedAt")
      .sort({ navbarOrder: 1, createdAt: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    [
      "metaTitle",
      "metaDescription",
      "metaKeywords",
      "canonicalUrl",
      "openGraphTitle",
      "openGraphDescription",
      "openGraphImage",
      "twitterTitle",
      "twitterDescription",
      "twitterCard",
      "robots",
    ].forEach((field) => delete updateData[field]);

    if (Object.prototype.hasOwnProperty.call(updateData, "slug") || updateData.name) {
      const resolvedSlug = resolveCategorySlug(updateData.slug, updateData.name);
      if (!resolvedSlug || !isValidSlug(resolvedSlug)) {
        return res.status(400).json({
          message: "Slug must use only letters, numbers, and single hyphens.",
        });
      }

      await ensureSlugAvailable(resolvedSlug, id);
      updateData.slug = resolvedSlug;
    }

    if (Object.prototype.hasOwnProperty.call(updateData, "navbarOrder")) {
      updateData.navbarOrder = Number.isFinite(Number(updateData.navbarOrder))
        ? Number(updateData.navbarOrder)
        : 0;
    }

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateNavbarOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: "items array is required" });
    }

    await Promise.all(
      items.map((item) =>
        Category.findByIdAndUpdate(item.id, {
          navbarOrder: Number.isFinite(Number(item.navbarOrder))
            ? Number(item.navbarOrder)
            : 0,
        }),
      ),
    );

    const categories = await Category.find()
      .select("name slug image description navbarOrder createdAt updatedAt")
      .sort({ navbarOrder: 1, createdAt: 1 });

    res.json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
