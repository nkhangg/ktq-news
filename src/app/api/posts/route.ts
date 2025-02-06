import { getCache, setCache } from '@/lib/cache-service';
import connectDB from '@/lib/mongoose';
import { CategoryModel } from '@/models/category';
import { PostModel } from '@/models/post';
import { UserModel } from '@/models/user';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);

        const search = searchParams.get('search') || '';
        const categorySlug = searchParams.get('category');
        const ttr = parseInt(searchParams.get('ttr') || '0');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const sortField = searchParams.get('sortField') || 'createdAt';
        const sortOrder = parseInt(searchParams.get('sortOrder') || '-1');
        const ignoreParam = searchParams.get('ignore');

        const query: Record<string, unknown> = {};
        if (search) {
            query.$or = [{ title: { $regex: search, $options: 'i' } }, { slug: { $regex: search, $options: 'i' } }];
        }
        if (categorySlug) {
            const category = await CategoryModel.findOne({ slug: categorySlug });
            if (category) {
                query.category = category._id;
            }
        }

        if (ttr === 1) {
            query.ttr = { $gt: 300 };
        } else if (ttr === -1) {
            query.ttr = { $lte: 300 };
        }

        if (ignoreParam) {
            const ignoreIds = ignoreParam.split(',').map((id) => id.trim());
            query._id = { $nin: ignoreIds };
        }

        const options = {
            populate: [
                {
                    path: 'user',
                    select: '-password',
                    model: UserModel,
                },
                {
                    path: 'category',
                    model: CategoryModel,
                },
            ],
            page,
            limit,
            sort: { [sortField]: sortOrder },
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

        const cache_key = `POST_${JSON.stringify({ query, options })}`;

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
