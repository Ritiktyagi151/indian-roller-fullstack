const Product = require("../models/Product");
const Category = require("../models/Category");
const slugify = require("slugify");

function parseJson(value, fallback) {
  if (!value) {
    return fallback;
  }
  if (Array.isArray(value) || typeof value === "object") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function getFilePath(file) {
  return file ? `/uploads/${file.filename}` : "";
}

function normalizeCategoryIds(value) {
  const parsed = parseJson(value, value);

  if (!parsed) {
    return [];
  }

  if (Array.isArray(parsed)) {
    return parsed.filter(Boolean);
  }

  return [parsed].filter(Boolean);
}

function normalizeManualSlug(slug) {
  return String(slug || "").trim().replace(/^\/+|\/+$/g, "");
}

function resolveProductSlug(slug, name) {
  const manualSlug = normalizeManualSlug(slug);
  if (manualSlug) {
    return manualSlug;
  }

  return slugify(String(name || "").trim(), { lower: true, strict: true });
}

function isValidSlug(slug) {
  return /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/.test(slug);
}

async function ensureSlugAvailable(slug, productId) {
  const productConflict = await Product.findOne({
    slug,
    ...(productId ? { _id: { $ne: productId } } : {}),
  }).select("_id");

  if (productConflict) {
    throw new Error("This slug is already in use by another product.");
  }

  const categoryConflict = await Category.findOne({ slug }).select("_id");
  if (categoryConflict) {
    throw new Error("This slug is already in use by a category.");
  }
}

function normalizeProductData(body, files) {
  const data = { ...body };
  const hasCategoryIds = Object.prototype.hasOwnProperty.call(body, "categoryIds");
  const hasCategoryId = Object.prototype.hasOwnProperty.call(body, "categoryId");
  const hasCategory = Object.prototype.hasOwnProperty.call(body, "category");
  const restrictedFields = [
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
  ];

  restrictedFields.forEach((field) => delete data[field]);

  if (data.name) {
    data.slug = resolveProductSlug(data.slug, data.name);
  }

  if (hasCategoryIds || hasCategoryId || hasCategory) {
    const categoryIds = normalizeCategoryIds(data.categoryIds);
    const legacyCategoryIds = normalizeCategoryIds(data.categoryId || data.category);
    const mergedCategoryIds = Array.from(
      new Set([...categoryIds, ...legacyCategoryIds].filter(Boolean)),
    );

    data.categories = mergedCategoryIds;
    data.category = mergedCategoryIds[0] || undefined;
  }

  delete data.categoryIds;

  const primaryImage = getFilePath(files.image?.[0]);
  const galleryImages = (files.images || []).map(getFilePath).filter(Boolean);
  const video = getFilePath(files.video?.[0]);
  const technicalDrawing = getFilePath(files.technicalDrawing?.[0]);
  const catalogDownload = getFilePath(files.catalogDownload?.[0]);

  if (primaryImage) {
    data.image = primaryImage;
  }
  if (galleryImages.length) {
    data.images = galleryImages;
    if (!data.image) {
      data.image = galleryImages[0];
    }
  } else if (typeof data.images === "string") {
    data.images = parseJson(data.images, []);
  }

  if (video) {
    data.video = video;
  }
  if (technicalDrawing) {
    data.technicalDrawings = [technicalDrawing];
  } else if (typeof data.technicalDrawings === "string") {
    data.technicalDrawings = parseJson(data.technicalDrawings, []);
  }
  if (catalogDownload) {
    data.catalogDownload = catalogDownload;
  }

  data.specifications = parseJson(data.specifications, []);
  data.features = parseJson(data.features, []);
  data.faqs = parseJson(data.faqs, []);
  data.relatedProducts = parseJson(data.relatedProducts, []);

  return data;
}

function productPopulate(query) {
  return query
    .populate("category", "name slug")
    .populate("categories", "name slug")
    .populate("relatedProducts", "name slug image");
}

// ✅ OPTIMIZED - Sirf zaruri fields fetch karta hai
exports.getAllProducts = async (req, res) => {
  try {
    const products = await productPopulate(Product.find()).sort({ createdAt: -1 });
    res.json(products || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const data = normalizeProductData(req.body, req.files || {});

    if (!data.name || !data.categories?.length) {
      return res
        .status(400)
        .json({ message: "Product name and at least one category are required." });
    }

    if (!data.slug || !isValidSlug(data.slug)) {
      return res.status(400).json({
        message: "Slug must use only letters, numbers, and single hyphens.",
      });
    }

    await ensureSlugAvailable(data.slug);

    const product = await Product.create(data);
    const populatedProduct = await productPopulate(Product.findById(product._id));
    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ OPTIMIZED - Pehle category find karo, phir direct DB filter (JS filter hataya)
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const Category = require("../models/Category");
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) return res.json([]);
    const products = await productPopulate(
      Product.find({
        $or: [{ category: category._id }, { categories: category._id }],
      }).select("name slug image shortDescription category categories"),
    )
      .sort({ createdAt: -1 });
    res.json(products || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await productPopulate(Product.findOne({ slug }));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = normalizeProductData(req.body, req.files || {});

    if (updateData.categories && !updateData.categories.length) {
      return res
        .status(400)
        .json({ message: "At least one category is required." });
    }

    if (updateData.slug) {
      if (!isValidSlug(updateData.slug)) {
        return res.status(400).json({
          message: "Slug must use only letters, numbers, and single hyphens.",
        });
      }

      await ensureSlugAvailable(updateData.slug, id);
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const populatedProduct = await productPopulate(Product.findById(product._id));
    res.json(populatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
