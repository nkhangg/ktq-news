import { deleteCacheByPrefix } from '@/lib/cache-service';
import connectDB from '@/lib/mongoose';
import { CategoryModel } from '@/models/category';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const categorySchema = z.object({
    description: z.string().min(1, 'Description is required'),
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
});

export async function DELETE(request: Request, { params }: { params: Promise<{ _id: string }> }) {
    try {
        const { _id } = await params;

        if (!_id || (_id as string).length <= 0) {
            return NextResponse.json({ message: 'Id is required' }, { status: 400 });
        }

        await connectDB();

        const result = await CategoryModel.deleteOne({ _id });

        if (result.deletedCount <= 0) return NextResponse.json({ message: 'Delete error' }, { status: 400 });

        await deleteCacheByPrefix('categories');

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

        const parsedData = categorySchema.safeParse(data);

        if (!parsedData.success) {
            return NextResponse.json(
                { message: 'Validation fail', error: parsedData.error.errors.map((e) => `${e.path} ${e.message}`.toLocaleLowerCase()).join(', ') },
                { status: 400 },
            );
        }

        const { slug, description, name } = parsedData.data;

        await connectDB();

        const existingCategory = await CategoryModel.findOne({ slug, _id: { $ne: _id } }).lean();
        if (existingCategory) {
            return NextResponse.json({ message: 'Slug is already taken' }, { status: 400 });
        }

        const updatedCategory = await CategoryModel.findByIdAndUpdate(_id, { slug, description, name }, { new: true, runValidators: true }).lean();

        if (!updatedCategory) {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }

        await deleteCacheByPrefix('categories');

        return NextResponse.json({ message: 'Category updated successfully', data: updatedCategory });
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
}
