import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/rubber-compound-HNBR",
        destination: "/products-hnbr-roller",
        permanent: true,
      },
      {
        source: "/blog-detail-Miscellaneous-Rollers-Versatile-Solutions-for-Diverse-Industrial-Needs",
        destination: "/blogs-detail-miscellaneous-rollers-versatile-solutions-for-diverse-industrial-needs",
        permanent: true,
      },
      {
        source: "/products-Steel-Industry",
        destination: "/products-steel-industry",
        permanent: true,
      },
      {
        source: "/service-Textile-Industry",
        destination: "/products-textile-industry",
        permanent: true,
      },
      {
        source: "/products-Food-Industry",
        destination: "/products-food-industry",
        permanent: true,
      },
      {
        source: "/products-EPDM-Rubber-Roller-Manufacturer",
        destination: "/products-epdm-rubber-roller-manufacturer",
        permanent: true,
      },
      {
        source: "/blog-detail-Accumulator-Roller-with-Durable-and-Strong-Build",
        destination: "/blogs-detail-accumulator-roller-with-durable-and-strong-build",
        permanent: true,
      },
      {
        source: "/products-HNBR",
        destination: "/products-hnbr-roller",
        permanent: true,
      },
      {
        source: "/blog-detail-Rollers-for-Steel-Industry-Precision-and-Strength",
        destination: "/blogs-detail-rollers-for-steel-industry-precision-and-strength",
        permanent: true,
      },
      {
        source: "/blog-detail-Applicator-Roller-for-Smooth-and-Even-Coating",
        destination: "/blogs-detail-applicator-roller-for-smooth-and-even-coating",
        permanent: true,
      },
      {
        source: "/blog-detail-Trusted-EPDM-rubber-roller-manufacturer-for-industrial-use",
        destination: "/blogs-detail-trusted-epdm-rubber-roller-manufacturer-for-industrial-use",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;