import connectDB from '@/lib/mongoose';
import { CategoryModel } from '@/models/category';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectDB();

        const collections = await CategoryModel.find();

        return NextResponse.json(collections);
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
}
