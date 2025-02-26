/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://ktq-blogs.com', // Thay đổi thành URL của web mày
    generateRobotsTxt: true, // Tạo file robots.txt
    changefreq: 'daily', // Tần suất cập nhật trang
    priority: 0.8, // Mức độ ưu tiên của URL
    sitemapSize: 5000, // Số lượng URL tối đa trong mỗi file sitemap
    robotsTxtOptions: {
        policies: [
            { userAgent: '*', allow: '/' }, // Cho phép tất cả bot truy cập toàn bộ trang
        ],
    },
};

module.exports = config;
