import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { PostModel } from '@/models/post';
import { CategoryModel } from '@/models/category';

export async function GET() {
    try {
        await connectDB();

        const category_count = await CategoryModel.countDocuments();

        const post_count = await PostModel.countDocuments();

        return NextResponse.json({ category_count, post_count });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
}
