const Product = require("../models/Product");
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

function normalizeProductData(body, files) {
  const data = { ...body };
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
    data.slug = data.slug
      ? slugify(data.slug, { lower: true, strict: true })
      : slugify(data.name, { lower: true, strict: true });
  }

  if (data.categoryId) {
    data.category = data.categoryId;
  }

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

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .select("name slug image shortDescription category")
      .populate("category", "name slug")
      .populate("relatedProducts", "name slug image")
      .sort({ createdAt: -1 });
    res.json(products || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const data = normalizeProductData(req.body, req.files || {});

    if (!data.name || !data.category) {
      return res.status(400).json({ message: "Product name and category are required." });
    }

    const product = await Product.create(data);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const products = await Product.find().populate("category");
    const filtered = products.filter(
      (product) => product.category && product.category.slug === categorySlug,
    );
    res.json(filtered || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug })
      .populate("category")
      .populate("relatedProducts", "name slug image");
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

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
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
