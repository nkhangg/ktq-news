import { deleteCacheByPrefix } from '@/lib/cache-service';
import connectDB from '@/lib/mongoose';
import { MediaModel } from '@/models/media';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: Promise<{ _id: string }> }) {
    try {
        const { _id } = await params;

        if (!_id || (_id as string).length <= 0) {
            return NextResponse.json({ message: 'Id is required' }, { status: 400 });
        }

        await connectDB();

        const result = await MediaModel.deleteOne({ _id });

        if (result.deletedCount <= 0) return NextResponse.json({ message: 'Delete error' }, { status: 400 });

        await deleteCacheByPrefix('medias');

        return NextResponse.json({ message: 'Delete Success', data: true });
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
}
