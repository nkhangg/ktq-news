import { deleteCacheByPrefix } from '@/lib/cache-service';
import connectDB from '@/lib/mongoose';
import { CategoryModel } from '@/models/category';
import { PostModel } from '@/models/post';
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

export async function GET(request: Request, { params }: { params: Promise<{ _id: string }> }) {
    try {
        const { _id } = await params;

        if (!_id || (_id as string).length <= 0) {
            return NextResponse.json({ message: 'Id is required' }, { status: 400 });
        }

        await connectDB();

        const result = await PostModel.findById({ _id }).populate([
            {
                path: 'category',
                model: CategoryModel,
            },
        ]);

        if (!result) return NextResponse.json({ message: 'Data not found' }, { status: 400 });
        await deleteCacheByPrefix('POST');

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ _id: string }> }) {
    try {
        const { _id } = await params;

        if (!_id || (_id as string).length <= 0) {
            return NextResponse.json({ message: 'Id is required' }, { status: 400 });
        }

        await connectDB();

        const result = await PostModel.deleteOne({ _id });

        if (result.deletedCount <= 0) return NextResponse.json({ message: 'Delete error' }, { status: 400 });
        await deleteCacheByPrefix('POST');

        return NextResponse.json({ message: 'Delete Success', data: true });
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
}

export async function POST(request: Request, { params }: { params: Promise<{ _id: string }> }) {
    try {
        const { _id } = await params;

        if (!_id || (_id as string).length <= 0) {
            return NextResponse.json({ message: 'Id is required' }, { status: 400 });
        }

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

        const existingPost = await PostModel.findOne({ slug, _id: { $ne: _id } }).lean();
        if (existingPost) {
            return NextResponse.json({ message: 'Slug is already taken' }, { status: 400 });
        }

        const updatedData = await PostModel.findByIdAndUpdate(_id, { ...prevData, category: category_id }, { new: true, runValidators: true }).lean();

        if (!updatedData) {
            return NextResponse.json({ message: 'Post not found' }, { status: 404 });
        }

        await deleteCacheByPrefix('POST');

        return NextResponse.json({ message: 'Post updated successfully', data: updatedData });
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
}
