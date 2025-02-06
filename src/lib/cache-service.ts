import { CacheModel } from '@/models/cache';

export const getCache = async (cache_key: string) => {
    const cache_data = await CacheModel.findOne({ cache_key });

    if (!cache_data) return null;

    const createdAt = cache_data.createdAt;
    const ttl = cache_data.ttl;

    if (!createdAt || !ttl) {
        return null;
    }

    const currentTime = Date.now();
    const createdAtTime = new Date(createdAt).getTime();
    const expirationTime = createdAtTime + ttl * 1000;

    const timeRemaining = expirationTime - currentTime;

    if (timeRemaining <= 0) {
        await deleteCache(cache_key);
        return null;
    }

    return cache_data;
};

export const setCache = async (cache_key: string, value: string, ttl = 300) => {
    const cache_data = await CacheModel.findOneAndUpdate({ cache_key }, { cache_key, value, ttl }, { new: true, upsert: true });

    if (!cache_data) return null;

    return cache_data;
};

export const deleteCache = async (cache_key: string) => {
    const result = await CacheModel.deleteOne({ cache_key });

    if (!result) return null;

    return result;
};

export const deleteCacheByPrefix = async (cache_key: string) => {
    try {
        if (!cache_key) {
            throw new Error('Cache key is required');
        }

        const result = await CacheModel.deleteMany({ cache_key: { $regex: `^${cache_key}` } });

        if (result.deletedCount === 0) {
            return null;
        }

        return result;
    } catch (error) {
        console.error('Error deleting cache:', error);
        throw error;
    }
};
