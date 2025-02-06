// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://ktqnews.com', // Change to your website's URL
    generateRobotsTxt: true, // Optional: Generates robots.txt file
    changefreq: 'daily', // How often your pages may change
    priority: 0.8, // Default priority for URLs
    sitemapSize: 5000, // Maximum entries per sitemap file
    exclude: ['/admin/**'], // Exclude paths from the sitemap if needed
    robotsTxtOptions: {
        policies: [
            { userAgent: '*', allow: '/' },
            { userAgent: '*', disallow: '/admin' },
        ],
    },
};

module.exports = config;
