import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  htmlLimitedBots: /.*/,
  
  // FIXED: Deprecation warning fixed by using remotePatterns
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'media.istockphoto.com' },
    ],
  },
  
  webpack: (config) => {
    config.snapshot = {
      ...(config.snapshot || {}),
      managedPaths: [/^(.+?[\\/]node_modules[\\/])((?!next).)*$/],
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:5003/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://127.0.0.1:5003/uploads/:path*',
      },
    ];
  },
  async redirects() {
    return [
      // ==========================================
      // 1. PHP & BASE PAGES REDIRECTS
      // ==========================================
      { source: '/contact.php', destination: '/contact', permanent: true },
      { source: '/career.php', destination: '/career', permanent: true },
      { source: '/about.php', destination: '/about', permanent: true },
      { source: '/gallery.php', destination: '/gallery', permanent: true },
      { source: '/blog-4.php', destination: '/blogs', permanent: true },
      { source: '/blog.php', destination: '/blogs', permanent: true },
      { source: '/index.php', destination: '/', permanent: true },
      { source: '/index', destination: '/', permanent: true },
      { source: '/applicator-roller.php', destination: '/applicator-roller-manufacturer', permanent: true },
      { source: '/digital-marketing-agency', destination: '/', permanent: true },
      { source: '/get-quote', destination: '/', permanent: true },

      // Tracking param
      { source: '/', has: [{ type: 'query', key: 'trk', value: 'public_post-text' }], destination: '/', permanent: true },

      // ==========================================
      // 2. SERVICE PAGES (HYPHEN / SPACES / MISC)
      // ==========================================
      { source: '/service-Paper-And-Packaging-Industry', destination: '/paper-and-packaging-industry', permanent: true },
      { source: '/service-NBR', destination: '/products-nbr', permanent: true },
      { source: '/service-Steel-Industry', destination: '/products-steel-industry', permanent: true },
      { source: '/service-Steel%20Industry', destination: '/products-steel-industry', permanent: true },
      { source: '/service-Ebonite', destination: '/ebonite-rubber-roller-manufacturer', permanent: true },
      { source: '/service-Food-Industry', destination: '/food-industry', permanent: true },
      { source: '/service-Food%20Industry', destination: '/food-industry', permanent: true },
      { source: '/service-Plywood-Industry', destination: '/plywood-industry', permanent: true },
      { source: '/service-Plywood%20Industry', destination: '/plywood-industry', permanent: true },
      { source: '/service-Textile-Industry', destination: '/textile-industry', permanent: true },
      { source: '/service-Textile%20Industry', destination: '/textile-industry', permanent: true },
      { source: '/service-Rexene-Industry', destination: '/rexene-industry', permanent: true },
      { source: '/service-Rexene%20Industry', destination: '/rexene-industry', permanent: true },
      { source: '/service-Turnkey-Project', destination: '/turnkey-project', permanent: true },
      { source: '/service-Turnkey%20Project', destination: '/turnkey-project', permanent: true },
      { source: '/service-Biscuit-Roller', destination: '/', permanent: true },
      { source: '/service-', destination: '/', permanent: true },

      // ==========================================
      // 3. PRODUCTS & RUBBER COMPOUNDS REDIRECTS
      // ==========================================
      // { source: '/products-EPDM', destination: '/products-epdm-rubber-roller-manufacturer', permanent: true },
      // { source: '/products-EPDM-Rubber-Roller-Manufacturer', destination: '/products-epdm-rubber-roller-manufacturer', permanent: true },
      // { source: '/rubber-compound-EPDM', destination: '/products-epdm-rubber-roller-manufacturer', permanent: true },
      
      { source: '/products-NBR', destination: '/products-nbr', permanent: true },
      { source: '/rubber-compound-NBR', destination: '/products-nbr', permanent: true },
      
      { source: '/products-Hypalon', destination: '/products-hypalon-rubber-roller', permanent: true },
      { source: '/products-Hypalon-Rubber-Roller', destination: '/products-hypalon-rubber-roller', permanent: true },
      { source: '/rubber-compound-Hypalon', destination: '/products-hypalon-rubber-roller', permanent: true },
      
      { source: '/rubber-compound-HNBR', destination: '/products-hnbr', permanent: true },
      { source: '/products-rubber-compounds', destination: '/products-hnbr', permanent: true },
      
      { source: '/products-Steel-Industries', destination: '/products-steel-industry', permanent: true },
      { source: '/accumulator-roller', destination: '/accumulator-roller-manufacturer', permanent: true },
      { source: '/products-Plywood-Industry', destination: '/plywood-industry', permanent: true },
      { source: '/products-Miscellaneous-Roller', destination: '/miscellaneous-roller', permanent: true },
      { source: '/products-turnkey-project', destination: '/turnkey-project', permanent: true },
      { source: '/products-textile-industry', destination: '/textile-industry', permanent: true },
      { source: '/products-Natural-Rubber', destination: '/natural-rubber-roller-manufacturer', permanent: true },
      { source: '/products-Paper-And-Packaging-Industry', destination: '/paper-and-packaging-industry', permanent: true },
      { source: '/products-Polyurethane-Rubber', destination: '/polyurethane-roller', permanent: true },
      { source: '/rubber-compound-Polyurethane-Rubber', destination: '/polyurethane-roller', permanent: true },
      { source: '/products-Rexene-Industry', destination: '/rexene-industry', permanent: true },
      { source: '/products-Silicone-Rubber', destination: '/silicone-roller', permanent: true },

      // ==========================================
      // 4. BLOGS & DETAIL PAGES REDIRECTS
      // ==========================================
      { source: '/blog-detail-Trusted-EPDM-rubber-roller-manufacturer-for-industrial-use', destination: '/blogs-detail-trusted-epdm-rubber-roller-manufacturer-for-industrial-use', permanent: true },
      { source: '/blogs-applicator-roller-for-smooth-and-even-coating', destination: '/blogs-detail-applicator-roller-for-smooth-and-even-coating', permanent: true },
      { source: '/blog-detail-The-Impact-of-Rubber-Rollers-on-the-Rexene-Industry', destination: '/blogs-detail-the-impact-of-rubber-rollers-on-the-rexene-industry', permanent: true },
      { source: '/blog-detail-How-Industrial-Rollers-Drive-Efficiency-in-the-Steel-Industry', destination: '/blogs-detail-how-industrial-rollers-drive-efficiency-in-the-steel-industry', permanent: true },
      
      // FIXED: Escaped the colon (\:) so Next.js doesn't parse it as a parameter name
      { source: '/https\\:/www.indianroller.com/blog-detail-Applicator-Roller-for-Smooth-and-Even-Coating', destination: '/blogs-detail-applicator-roller-for-smooth-and-even-coating', permanent: true },
    ];
  },
};

export default nextConfig;