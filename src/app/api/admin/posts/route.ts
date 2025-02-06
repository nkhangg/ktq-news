import { deleteCacheByPrefix } from '@/lib/cache-service';
import connectDB from '@/lib/mongoose';
import { CategoryModel } from '@/models/category';
import { PostModel } from '@/models/post';
import { UserModel } from '@/models/user';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const postSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    thumbnail: z.string().url('Thumbnail must be a valid URL'),
    slug: z.string().min(1, 'Slug is required'),
    content: z.string().min(1, 'Content is required'),
    preview_content: z.string(),
    category_id: z.string().min(1, 'Category ID must be a valid UUID'),
    ttr: z.coerce.number().positive('TTR must be a positive number'),
});

export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);

        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const sortField = searchParams.get('sortField') || 'createdAt';
        const sortOrder = parseInt(searchParams.get('sortOrder') || '-1');

        const query: Record<string, unknown> = {};
        if (search) {
            query.$or = [{ title: { $regex: search, $options: 'i' } }, { slug: { $regex: search, $options: 'i' } }];
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

        const result = await PostModel['paginate'](query, options);

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const parsedData = postSchema.safeParse(data);

        if (!parsedData.success) {
            return NextResponse.json(
                { message: 'Validation fail', error: parsedData.error.errors.map((e) => `${e.path} ${e.message}`.toLocaleLowerCase()).join(', ') },
                { status: 400 },
            );
        }

        const { slug, category_id, ...prevData } = parsedData.data;

        await connectDB();

        const existingPost = await PostModel.findOne({ slug }).lean();
        if (existingPost) {
            return NextResponse.json({ message: 'Slug is already taken' }, { status: 400 });
        }

        const admin = await UserModel.findOne({ username: 'admin', role: 'admin' });

        if (!admin) {
            return NextResponse.json({ message: 'Admin is not found' }, { status: 400 });
        }

        const createData = await PostModel.create({ ...prevData, slug, category: category_id, user: admin._id });

        if (!createData) {
            return NextResponse.json({ message: 'Post not found' }, { status: 404 });
        }

        await deleteCacheByPrefix('POST');

        return NextResponse.json({ message: 'Post created successfully', data: createData });
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
}
