const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true
  },
  image: {
    type: String
  },
  banner: {
    desktop: {
      type: String,
      default: ""
    },
    mobile: {
      type: String,
      default: ""
    },
    height: {
      type: String,
      default: ""
    }
  },
  description: {
    type: String
  },
  navbarOrder: {
    type: Number,
    default: 0
  },
  metaTitle: {
    type: String
  },
  metaDescription: {
    type: String
  },
  metaKeywords: {
    type: String
  },
  canonicalUrl: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
