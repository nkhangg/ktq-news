import connectDB from '@/lib/mongoose';
import { CategoryModel } from '@/models/category';
import { PostModel } from '@/models/post';
import { UserModel } from '@/models/user';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ _id: string }> }) {
    try {
        await connectDB();
        const { _id } = await params;

        const post = await PostModel.findOne({ _id }).populate('user', '-password', UserModel).populate('category', '', CategoryModel);

        if (!post) {
            return NextResponse.json({ error: 'Not found post' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Not found post' }, { status: 404 });
    }
}
