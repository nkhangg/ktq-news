import { getCache, setCache } from '@/lib/cache-service';
import connectDB from '@/lib/mongoose';
import { PostModel } from '@/models/post';
import { SearchHistoryModel } from '@/models/search-history';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);

        const limit = parseInt(searchParams.get('limit') || '10');

        const cache_key = 'SEARCH_HISTORIES_' + limit;

        const cache_data = await getCache(cache_key);

        if (cache_data) {
            return NextResponse.json(JSON.parse(cache_data.value));
        }

        const searchHistories = await SearchHistoryModel.find()
            .populate({
                path: 'post',
                select: 'slug title',
                model: PostModel,
            })
            .sort({ search_count: -1 })
            .limit(limit)
            .lean();

        await setCache(cache_key, JSON.stringify(searchHistories), 30);

        return NextResponse.json(searchHistories);
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();

        const { post_id } = await request.json();

        const post = await PostModel.findById(post_id).lean();

        if (!post) {
            return NextResponse.json({ error: 'Not found post ' }, { status: 404 });
        }

        const result = await SearchHistoryModel.findOneAndUpdate(
            { post: post_id },
            { $inc: { search_count: 1 } },
            {
                new: true,
                upsert: true,
            },
        ).lean();

        if (!result) return NextResponse.json(false);

        return NextResponse.json(true);
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
}
