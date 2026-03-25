const Blog = require("../models/Blog");

// 🛠️ Utility Function: Title ko Slug mein badalne ke liye
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Spaces ko hyphen (-) se badlo
    .replace(/[^\w-]+/g, "") // Special characters hatao
    .replace(/--+/g, "-"); // Double hyphens hatao
};

// --- 🚀 CREATE BLOG ---
exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      author,
      customDate,
      category,
      description,
      status,
    } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({
        message: "Title, category, and content are required.",
      });
    }

    const blogData = {
      title,
      slug: slug ? slugify(slug) : slugify(title),
      author: author || "Admin",
      customDate: customDate ? new Date(customDate) : new Date(),
      category,
      description,
      status: status || "Draft",
      image: req.file ? `/uploads/${req.file.filename}` : "",
    };
    const newBlog = new Blog(blogData);
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(500).json({
      message: "Error creating blog. Title might be duplicate.",
      error: err,
    });
  }
};

// --- 🔍 GET ALL BLOGS ---
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ customDate: -1, createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json(err);
  }
};

// --- 📄 GET SINGLE BLOG BY SLUG (SEO Friendly) ---
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json(err);
  }
};

// --- 🆔 GET BLOG BY ID (Missing function that caused the crash) ---
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json(err);
  }
};

// --- 📝 UPDATE BLOG ---
exports.updateBlog = async (req, res) => {
  try {
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

    if (req.body.title || req.body.slug) {
      updateData.slug = req.body.slug
        ? slugify(req.body.slug)
        : slugify(req.body.title);
    }

    if ("customDate" in updateData) {
      updateData.customDate = updateData.customDate
        ? new Date(updateData.customDate)
        : new Date();
    }

    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      {
        new: true,
        returnDocument: "after", // 🔥 Deprecation warning fix
      },
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
};

// --- 🗑️ DELETE BLOG ---
exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};
