import connectDB from '@/lib/mongoose';
import { CategoryModel } from '@/models/category';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const categorySchema = z.object({
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().min(1, 'Description is required'),
    name: z.string().min(1, 'Name is required'),
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

        const result = await CategoryModel['paginate'](query, options);

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const parsedData = categorySchema.safeParse(data);

        if (!parsedData.success) {
            return NextResponse.json(
                { message: 'Validation fail', error: parsedData.error.errors.map((e) => `${e.path} ${e.message}`.toLocaleLowerCase()).join(', ') },
                { status: 400 },
            );
        }

        const { slug, description, name } = parsedData.data;

        await connectDB();

        const slugCategory = await CategoryModel.findOne({ slug }).lean();

        if (slugCategory) return NextResponse.json({ message: 'Slug is unique' }, { status: 400 });

        const newCategory = new CategoryModel({ slug, description, name });
        await newCategory.save();

        return NextResponse.json({ message: 'Category created successfully', data: newCategory });
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
}
