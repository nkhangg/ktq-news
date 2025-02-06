import Constant from '@/constants';
import { getCache, setCache } from '@/lib/cache-service';
import connectDB from '@/lib/mongoose';
import { ConfigModel } from '@/models/configs';

const isBuildTime = typeof window === 'undefined';

export const generateBaseUrl = () => {
    return isBuildTime ? process.env.NEXT_PUBLIC_BASE_URL : '/api/data';
};

export const getContactData = async () => {
    try {
        await connectDB();

        const cacheKey = 'configs/contact-data';

        const cacheData = await getCache(cacheKey);

        if (cacheData) {
            return JSON.parse(cacheData.value);
        }

        const configs: IConfig[] = await ConfigModel.find({
            key: { $in: [Constant.PRIMARY_EMAIL_KEY, Constant.CONTACT_EMAIL_KEY] },
        });

        await setCache(cacheKey, JSON.stringify(configs), 500);

        return configs;
    } catch (error) {
        console.log(error);
        return [];
    }
};

export async function getSliders() {
    const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sliders`, { cache: 'force-cache', next: { revalidate: 500 } });
    return await data.json();
}

export async function getCategoriesTopic() {
    const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories/outstanding/?limit=10`, {
        cache: 'force-cache',
        next: { tags: ['categories/outstanding_limit=10'], revalidate: 300 },
    });

    return await data.json();
}
