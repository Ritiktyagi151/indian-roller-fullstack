const Category = require("../models/Category");
const slugify = require("slugify");

// ✅ 1. Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const data = {
      name,
      description,
      slug: slugify(name, { lower: true }),
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

// ✅ 2. Get All Categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ 3. Update Category (Fixed for Edit)
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

    if (updateData.name) {
      updateData.slug = slugify(updateData.name, { lower: true });
    }

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ 4. Delete Category (Fixed for 404)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
