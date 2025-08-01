import Constant from '@/constants';
import { notFound } from 'next/navigation';

const isBuildTime = typeof window === 'undefined';

export const generateBaseUrl = () => {
    return isBuildTime ? process.env.NEXT_PUBLIC_BASE_URL : '/api/data';
};

export const getContactData = async () => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/configs/contact-data`, { cache: 'no-cache', next: { revalidate: 500 } });

    const result = await data.json();

    return result?.data || [];
};

export async function getSliders() {
    const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/commons/sliders`, { cache: 'no-cache', next: { revalidate: 500 } });

    const result = await data.json();

    return result?.data || { post_count: 0, category_count: 0 };
}

export async function getStaticData() {
    const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/configs/static-sliders-data`, {
        cache: 'no-cache',
        next: { tags: ['configs/static-sliders-data'], revalidate: 300 },
    });

    const result = await data.json();

    if (result?.data && result?.data.value) {
        return JSON.parse(result?.data?.value);
    }

    return result?.data;
}

export async function getCategoriesTopic() {
    const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/commons/categories/outstanding`, {
        cache: 'no-cache',
        next: { tags: ['categories/outstanding_limit=20'], revalidate: 300 },
    });

    const result = await data.json();

    return result?.data || [];
}

export async function getCategories() {
    const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/categories?limit=20`, { cache: 'no-cache', next: { revalidate: 300, tags: ['categories?limit=20'] } });

    const result = await data.json();

    return result?.data || [];
}

export async function getFooterData() {
    const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/configs/footer-data`, { cache: 'no-cache', next: { tags: [Constant.FOOTER_DATA_KEY], revalidate: 300 } });

    const result = await data.json();

    return result?.data || [];
}

export const getData = async (slug: IPost['slug']) => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/posts/${slug}`, { cache: 'no-cache', next: { tags: [`posts/${slug}`], revalidate: 300 } });

    if (data.status != 200) {
        notFound();
    }

    const result = await data.json();

    if (!result?.data) {
        notFound();
    }

    return result?.data;
};

export const getHomeData = async () => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/commons/home-data`, { cache: 'no-cache', next: { revalidate: 300 } });

    if (data.status != 200) {
        notFound();
    }

    const result = await data.json();

    if (!result?.data) {
        notFound();
    }

    return result?.data;
};

export const getTags = async () => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tags?limit=40`, { cache: 'no-cache', next: { tags: ['tags?limit=20'], revalidate: 300 } });

    const result = await data.json();

    if (!result?.data) {
        notFound();
    }

    return result?.data;
};

export const getMetadata = async (slug: IPost['slug']) => {
    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/posts/metadata/${slug}`, { cache: 'no-cache', next: { revalidate: 300 } });

        const result = await data.json();

        return result?.data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return null;
    }
};

export const sitemaps = async (init?: RequestInit) => {
    try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/posts/sitemaps`, init);

        const result = await data.json();

        return result?.data || [];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        console.log(error);
        return [];
    }
};
