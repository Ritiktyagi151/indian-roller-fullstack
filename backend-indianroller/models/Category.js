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
  description: { 
    type: String // Rich Text/Quill HTML Content
  },
  // 🔥 SEO Master Fields
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