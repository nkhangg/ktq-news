import connectDB from '@/lib/mongoose';
import { CategoryModel } from '@/models/category';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectDB();

        const categories = await CategoryModel.aggregate([
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
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    slug: 1,
                    post_count: 1,
                },
            },
        ]);

        if (!categories.length) {
            return NextResponse.json({ error: 'Not found config' }, { status: 404 });
        }

        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
}
