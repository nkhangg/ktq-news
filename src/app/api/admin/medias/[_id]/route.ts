import { deleteCacheByPrefix } from '@/lib/cache-service';
import { deleteImage } from '@/lib/cloudinary';
import connectDB from '@/lib/mongoose';
import { MediaModel } from '@/models/media';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: Promise<{ _id: string }> }) {
    try {
        const { _id } = await params;

        const { public_id } = await request.json();

        if (!_id || (_id as string).length <= 0) {
            return NextResponse.json({ message: 'Id is required' }, { status: 400 });
        }

        if (!public_id) {
            return NextResponse.json({ message: 'Public id is required' }, { status: 400 });
        }

        await deleteImage(public_id);

        await connectDB();

        const result = await MediaModel.deleteOne({ _id, 'cloud_data.public_id': public_id });

        if (result.deletedCount <= 0) return NextResponse.json({ message: 'Delete error' }, { status: 400 });

        await deleteCacheByPrefix('medias');

        return NextResponse.json({ message: 'Delete Success', data: true });
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
}
