const mongoose = require("mongoose");

const seoEntrySchema = new mongoose.Schema(
  {
    pageKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    entityType: {
      type: String,
      enum: ["static", "blog", "product", "category"],
      required: true,
    },
    entityId: {
      type: String,
      required: true,
      trim: true,
    },
    pageName: {
      type: String,
      required: true,
      trim: true,
    },
    pageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    metaAuthor: {
      type: String,
      trim: true,
      default: "",
    },
    metaPublisher: {
      type: String,
      trim: true,
      default: "",
    },
    metaLanguage: {
      type: String,
      trim: true,
      default: "en",
    },
    metaRevisitAfter: {
      type: String,
      trim: true,
      default: "",
    },
    metaSubject: {
      type: String,
      trim: true,
      default: "",
    },
    metaClassification: {
      type: String,
      trim: true,
      default: "",
    },
    metaCoverage: {
      type: String,
      trim: true,
      default: "",
    },
    metaDistribution: {
      type: String,
      trim: true,
      default: "",
    },
    metaRating: {
      type: String,
      trim: true,
      default: "",
    },
    referrerPolicy: {
      type: String,
      trim: true,
      default: "",
    },
    themeColor: {
      type: String,
      trim: true,
      default: "",
    },
    metaTitle: {
      type: String,
      trim: true,
      default: "",
    },
    metaDescription: {
      type: String,
      trim: true,
      default: "",
    },
    metaKeywords: {
      type: String,
      trim: true,
      default: "",
    },
    canonicalUrl: {
      type: String,
      trim: true,
      default: "",
    },
    robots: {
      type: String,
      trim: true,
      default: "index, follow",
    },
    openGraphTitle: {
      type: String,
      trim: true,
      default: "",
    },
    openGraphDescription: {
      type: String,
      trim: true,
      default: "",
    },
    openGraphImage: {
      type: String,
      trim: true,
      default: "",
    },
    twitterTitle: {
      type: String,
      trim: true,
      default: "",
    },
    twitterDescription: {
      type: String,
      trim: true,
      default: "",
    },
    twitterCard: {
      type: String,
      trim: true,
      default: "summary_large_image",
    },
    schemaType: {
      type: String,
      trim: true,
      default: "Organization",
    },
    schemaJson: {
      type: String,
      default: "",
    },
    customHeadCode: {
      type: String,
      default: "",
    },
    hreflangs: [
      {
        locale: { type: String, trim: true, default: "" },
        url: { type: String, trim: true, default: "" },
      },
    ],
    additionalMetaTags: [
      {
        name: { type: String, trim: true, default: "" },
        property: { type: String, trim: true, default: "" },
        httpEquiv: { type: String, trim: true, default: "" },
        charset: { type: String, trim: true, default: "" },
        content: { type: String, trim: true, default: "" },
      },
    ],
    additionalLinkTags: [
      {
        rel: { type: String, trim: true, default: "alternate" },
        href: { type: String, trim: true, default: "" },
        hrefLang: { type: String, trim: true, default: "" },
        media: { type: String, trim: true, default: "" },
        type: { type: String, trim: true, default: "" },
        title: { type: String, trim: true, default: "" },
        sizes: { type: String, trim: true, default: "" },
      },
    ],
    sitemapPriority: {
      type: Number,
      default: 0.5,
    },
    sitemapChangefreq: {
      type: String,
      default: "weekly",
    },
    includeInSitemap: {
      type: Boolean,
      default: true,
    },
    isIndexed: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SeoEntry", seoEntrySchema);
