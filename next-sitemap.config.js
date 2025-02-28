const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ktq-blogs.com';

/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: siteURL,
    generateRobotsTxt: false,
    generateIndexSitemap: true,
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
    additionalPaths: async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/posts/sitemaps`, { next: { revalidate: 1800 } });

        const result = await response.json();

        const data = result?.data || [];

        const dynamicSitemaps = data.map((item) => {
            return {
                loc: `${siteURL}/${item.category.slug}/${item.slug}`,
                lastmod: new Date(item.updated_at).toISOString(),
                changefreq: 'daily',
                priority: 0.8,
            };
        });

        const static = [
            {
                loc: `${siteURL}/posts`,
                lastmod: new Date().toISOString(),
                changefreq: 'daily',
                priority: 0.7,
            },
            {
                loc: `${siteURL}/contact`,
                lastmod: new Date().toISOString(),
                changefreq: 'monthly',
                priority: 0.5,
            },
            {
                loc: `${siteURL}/about`,
                lastmod: new Date().toISOString(),
                changefreq: 'monthly',
                priority: 0.5,
            },
        ];

        return [...dynamicSitemaps, ...static];
    },
};

module.exports = config;
