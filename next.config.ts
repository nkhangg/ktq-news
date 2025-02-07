import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    experimental: {
        staleTimes: {
            dynamic: 30,
            static: 30,
        },
    },
    staticPageGenerationTimeout: 1000,
    output: 'standalone',
    async redirects() {
        return [
            {
                source: '/admin/login',
                has: [{ type: 'host', value: 'prerender' }],
                destination: '/',
                permanent: false,
            },
        ];
    },
    // pageExtensions: ['page.tsx', 'page.ts'],
};

export default nextConfig;
