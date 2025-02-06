import { getCache, setCache } from '@/lib/cache-service';
import connectDB from '@/lib/mongoose';
import { CategoryModel } from '@/models/category';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

const CACHE_KEY = 'categories/outstanding';

export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const limit = Number(searchParams.get('limit')) || 3;

        const ignoreParam = searchParams.get('ignore');
        const ignoreIds = ignoreParam ? ignoreParam.split(',') : [];

        const cache_data = await getCache(CACHE_KEY + `_${limit}_${ignoreIds.join('_')}`);

        if (cache_data) {
            return NextResponse.json(JSON.parse(cache_data.value));
        }

        const topCategories = await CategoryModel.aggregate([
            {
                $match: {
                    _id: { $nin: ignoreIds.filter(Boolean).map((id) => new mongoose.Types.ObjectId(id.trim())) },
                },
            },
            {
                $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'category',
                    as: 'posts',
                },
            },
            {
                $addFields: {
                    post_count: { $size: '$posts' },
                },
            },
            {
                $sort: { post_count: -1 },
            },
            {
                $limit: limit,
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    slug: 1,
                    post_count: 1,
                },
            },
        ]);

        await setCache(CACHE_KEY + `_${limit}_${ignoreIds.join('_')}`, JSON.stringify(topCategories));
        return NextResponse.json(topCategories);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
