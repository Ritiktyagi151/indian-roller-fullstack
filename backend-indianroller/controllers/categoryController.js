const Category = require("../models/Category");
const Product = require("../models/Product");
const slugify = require("slugify");
const fs = require("fs");
const path = require("path");

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

function normalizeBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value === "true" || value === "1";
  }

  return false;
}

function relativeUploadPath(file) {
  return file ? `/uploads/${file.filename}` : "";
}

function removeLocalUpload(filePath) {
  if (!filePath || typeof filePath !== "string" || !filePath.startsWith("/uploads/")) {
    return;
  }

  const absolutePath = path.join(__dirname, "..", filePath.replace(/^\//, ""));
  fs.promises.unlink(absolutePath).catch(() => {});
}

exports.createCategory = async (req, res) => {
  try {
    const { name, description, navbarOrder, slug, bannerHeight } = req.body;
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
      banner: {
        desktop: "",
        mobile: "",
        height: String(bannerHeight || "").trim(),
      },
    };

    const desktopBanner = relativeUploadPath(req.files?.bannerDesktop?.[0]);
    const mobileBanner = relativeUploadPath(req.files?.bannerMobile?.[0]);
    const legacyImage = relativeUploadPath(req.files?.image?.[0]);

    if (desktopBanner) {
      data.banner.desktop = desktopBanner;
    }
    if (mobileBanner) {
      data.banner.mobile = mobileBanner;
    }
    if (legacyImage) {
      data.image = legacyImage;
    } else if (desktopBanner) {
      data.image = desktopBanner;
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
      .select("name slug image banner description navbarOrder createdAt updatedAt")
      .sort({ navbarOrder: 1, createdAt: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug }).select(
      "name slug image banner description navbarOrder createdAt updatedAt",
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

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

    const nextBanner = {
      desktop: category.banner?.desktop || "",
      mobile: category.banner?.mobile || "",
      height: Object.prototype.hasOwnProperty.call(updateData, "bannerHeight")
        ? String(updateData.bannerHeight || "").trim()
        : (category.banner?.height || ""),
    };

    const removeDesktopBanner = normalizeBoolean(updateData.removeDesktopBanner);
    const removeMobileBanner = normalizeBoolean(updateData.removeMobileBanner);
    delete updateData.removeDesktopBanner;
    delete updateData.removeMobileBanner;
    delete updateData.bannerHeight;

    const nextDesktopBanner = relativeUploadPath(req.files?.bannerDesktop?.[0]);
    const nextMobileBanner = relativeUploadPath(req.files?.bannerMobile?.[0]);
    const nextLegacyImage = relativeUploadPath(req.files?.image?.[0]);

    if (removeDesktopBanner && category.banner?.desktop) {
      removeLocalUpload(category.banner.desktop);
      nextBanner.desktop = "";
    }

    if (removeMobileBanner && category.banner?.mobile) {
      removeLocalUpload(category.banner.mobile);
      nextBanner.mobile = "";
    }

    if (nextDesktopBanner) {
      if (category.banner?.desktop && category.banner.desktop !== nextDesktopBanner) {
        removeLocalUpload(category.banner.desktop);
      }
      nextBanner.desktop = nextDesktopBanner;
    }

    if (nextMobileBanner) {
      if (category.banner?.mobile && category.banner.mobile !== nextMobileBanner) {
        removeLocalUpload(category.banner.mobile);
      }
      nextBanner.mobile = nextMobileBanner;
    }

    if (nextLegacyImage) {
      if (category.image && category.image !== nextLegacyImage) {
        removeLocalUpload(category.image);
      }
      updateData.image = nextLegacyImage;
    } else if (nextDesktopBanner) {
      updateData.image = nextDesktopBanner;
    } else if (removeDesktopBanner && category.image === category.banner?.desktop) {
      updateData.image = "";
    }

    updateData.banner = nextBanner;

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json(updatedCategory);
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
      .select("name slug image banner description navbarOrder createdAt updatedAt")
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

    removeLocalUpload(category.image);
    removeLocalUpload(category.banner?.desktop);
    removeLocalUpload(category.banner?.mobile);

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
