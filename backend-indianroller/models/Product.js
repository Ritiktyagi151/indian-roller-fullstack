const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    sku: {
      type: String,
      trim: true,
    },
    shortDescription: {
      type: String,
    },
    image: {
      type: String, // Main Display Image
    },
    images: [
      {
        type: String,
      },
    ],
    video: {
      type: String,
    },
    catalogDownload: {
      type: String,
    },
    specifications: [
      {
        label: String,
        value: String,
      },
    ],
    features: [
      {
        type: String,
      },
    ],
    technicalDrawings: [
      {
        type: String,
      },
    ],
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    description: {
      type: String, // Quill HTML Content with Media Support
    },
    fullDescription: {
      type: String,
    },
    // 🔥 SEO Master Fields
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
    metaKeywords: {
      type: String,
    },
    canonicalUrl: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
