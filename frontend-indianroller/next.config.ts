/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "picsum.photos",
      "source.unsplash.com",
      "images.unsplash.com",
      "media.istockphoto.com",
    ],
  },
  webpack: (config) => {
    config.snapshot = {
      ...(config.snapshot || {}),
      managedPaths: [/^(.+?[\\/]node_modules[\\/])((?!next).)*$/],
    };
    return config;
  },
  async redirects() {
    return [
      // PHP pages
      { source: '/contact.php', destination: '/contact', permanent: true },
      { source: '/career.php', destination: '/career', permanent: true },
      { source: '/about.php', destination: '/about', permanent: true },
      { source: '/gallery.php', destination: '/gallery', permanent: true },
      { source: '/blog-4.php', destination: '/blogs', permanent: true },
      { source: '/blog.php', destination: '/blogs', permanent: true },
      { source: '/index.php', destination: '/', permanent: true },
      { source: '/index', destination: '/', permanent: true },
      { source: '/applicator-roller.php', destination: '/applicator-roller-manufacturer', permanent: true },

      // Tracking param
      { source: '/', has: [{ type: 'query', key: 'trk', value: 'public_post-text' }], destination: '/', permanent: true },

      // Service pages (with hyphen)
      { source: '/service-Biscuit-Roller', destination: '/', permanent: true },
      { source: '/service-', destination: '/', permanent: true },
      { source: '/service-Plywood-Industry', destination: '/plywood-industry', permanent: true },
      { source: '/service-Rexene-Industry', destination: '/rexene-industry', permanent: true },
      { source: '/service-Turnkey-Project', destination: '/turnkey-project', permanent: true },
      { source: '/service-Textile-Industry', destination: '/textile-industry', permanent: true },
      { source: '/service-Steel-Industry', destination: '/products-steel-industry', permanent: true },
      { source: '/service-Natural-Rubber', destination: '/natural-rubber-roller-manufacturer', permanent: true },
      { source: '/service-Ebonite', destination: '/ebonite-rubber-roller-manufacturer', permanent: true },
      { source: '/service-Food-Industry', destination: '/food-industry', permanent: true },

      // Service pages (with space - URL encoded %20)
      { source: '/service-Plywood%20Industry', destination: '/plywood-industry', permanent: true },
      { source: '/service-Textile%20Industry', destination: '/textile-industry', permanent: true },
      { source: '/service-Rexene%20Industry', destination: '/rexene-industry', permanent: true },
      { source: '/service-Turnkey%20Project', destination: '/turnkey-project', permanent: true },
      { source: '/service-Steel%20Industry', destination: '/products-steel-industry', permanent: true },
      { source: '/service-Food%20Industry', destination: '/food-industry', permanent: true },

      // Rubber compound pages
      { source: '/rubber-compound-Polyurethane-Rubber', destination: '/polyurethane-roller', permanent: true },
      { source: '/rubber-compound-Hypalon', destination: '/products-hypalon-rubber-roller', permanent: true },
      { source: '/rubber-compound-NBR', destination: '/products-nbr', permanent: true },

      // Product pages
      { source: '/products-Plywood-Industry', destination: '/plywood-industry', permanent: true },
      { source: '/products-Steel-Industries', destination: '/products-steel-industry', permanent: true },
      { source: '/accumulator-roller', destination: '/accumulator-roller-manufacturer', permanent: true },

      // Blog detail pages
      { source: '/blog-detail-How-Industrial-Rollers-Drive-Efficiency-in-the-Steel-Industry', destination: '/blogs-detail-how-industrial-rollers-drive-efficiency-in-the-steel-industry', permanent: true },
      { source: '/blog-detail-The-Impact-of-Rubber-Rollers-on-the-Rexene-Industry', destination: '/blogs-detail-the-impact-of-rubber-rollers-on-the-rexene-industry', permanent: true },

    ];
  },
};
export default nextConfig;