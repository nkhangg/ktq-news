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
    images: {
        unoptimized: false,
    },
};

export default nextConfig;
