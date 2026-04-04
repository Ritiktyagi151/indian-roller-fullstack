const Category = require("../models/Category");
const slugify = require("slugify");

exports.createCategory = async (req, res) => {
  try {
    const { name, description, navbarOrder, slug } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const lastCategory = await Category.findOne().sort({ navbarOrder: -1, createdAt: -1 });
    const nextOrder = Number.isFinite(Number(navbarOrder))
      ? Number(navbarOrder)
      : (lastCategory?.navbarOrder ?? -1) + 1;

    const data = {
      name,
      description,
      slug: slug
        ? slugify(slug, { lower: true, strict: true })
        : slugify(name, { lower: true, strict: true }),
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

    if (updateData.slug) {
      updateData.slug = slugify(updateData.slug, { lower: true, strict: true });
    } else if (updateData.name) {
      updateData.slug = slugify(updateData.name, { lower: true, strict: true });
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
