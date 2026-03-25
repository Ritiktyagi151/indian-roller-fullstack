const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // Manual URL
  author: { type: String, required: true }, // Manual Author
  customDate: { type: Date }, // Manual Publish Date
  category: { type: String, required: true },
  image: { type: String }, 
  description: { type: String, required: true },
  metaTitle: { type: String },
  metaKeywords: { type: String },
  metaDescription: { type: String },
  canonicalUrl: { type: String },
  status: { type: String, enum: ['Published', 'Draft'], default: 'Published' },
}, { timestamps: true });

module.exports = mongoose.model('Blog', BlogSchema);