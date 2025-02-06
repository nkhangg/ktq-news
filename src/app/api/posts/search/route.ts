import { getCache, setCache } from '@/lib/cache-service';
import connectDB from '@/lib/mongoose';
import { PostModel } from '@/models/post';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);

        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const sortOrder = parseInt(searchParams.get('sortOrder') || '-1');

        const query: Record<string, unknown> = {};
        if (search) {
            query.$or = [{ title: { $regex: search, $options: 'i' } }, { slug: { $regex: search, $options: 'i' } }];
        }

        const options = {
            select: 'slug title createdAt',
            page,
            limit,
            sort: { ['createdAt']: sortOrder },
            customLabels: {
                docs: 'data',
                totalDocs: 'total',
                limit: 'per_page',
                page: 'current_page',
                nextPage: 'from',
                prevPage: 'to',
                totalPages: 'last_page',
                hasPrevPage: 'has_prev_page',
                hasNextPage: 'has_next_page',
            },
        };

        const cache_key = `POST_SEARCH_${JSON.stringify({ query, options })}`;

        const cacheData = await getCache(cache_key);

        if (cacheData) {
            return NextResponse.json(JSON.parse(cacheData.value));
        }

        const result = await PostModel['paginate'](query, options);

        await setCache(cache_key, JSON.stringify(result), 30);

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
}
