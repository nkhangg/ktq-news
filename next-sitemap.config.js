/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://ktq-blogs.com',
    generateRobotsTxt: true,
    sitemapSize: 5000,
    changefreq: 'daily',
    priority: 0.8,
    exclude: ['/404'], // (Nếu có trang cần loại bỏ, chỉnh lại)
    transform: async (config, path) => {
        return {
            loc: path,
            changefreq: 'daily',
            priority: path === '/' ? 1.0 : 0.8,
            lastmod: new Date().toISOString(),
        };
    },
};

module.exports = config;
