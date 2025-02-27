import { sitemaps } from '@/ultils/data-fn';
import Routes from '@/ultils/routes';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const data: IPost[] = await sitemaps({
        next: { revalidate: 1800 }, // Cache trong 30 phút
    });

    const domain = process.env.NEXT_PUBLIC_SITE_URL || '';

    const dynamicSitemaps = data.map((item) => {
        return {
            url: `${domain}${Routes.GENERATE_POST_URL(item)}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        };
    }) as MetadataRoute.Sitemap;

    return [
        {
            url: domain,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${domain}/posts`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7,
        },
        {
            url: `${domain}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${domain}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...(dynamicSitemaps || {}),
    ];
}
