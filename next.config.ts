import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    experimental: {
        staleTimes: {
            dynamic: 30,
            static: 30,
        },
    },
    staticPageGenerationTimeout: 1000,
    // pageExtensions: ['page.tsx', 'page.ts'],
};

export default nextConfig;
