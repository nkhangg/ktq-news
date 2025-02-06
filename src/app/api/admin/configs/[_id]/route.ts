import Constant from '@/constants';
import { deleteCacheByPrefix } from '@/lib/cache-service';
import connectDB from '@/lib/mongoose';
import { ConfigModel } from '@/models/configs';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const configSchema = z.object({
    key: z.string().min(1, 'Name is required'),
    value: z.union([z.string().min(1, 'Value is required'), z.object({}), z.array(z.any()).min(1, 'Value array cannot be empty')]),
});

export async function POST(request: Request, { params }: { params: Promise<{ _id: string }> }) {
    try {
        const { _id } = await params;

        if (!_id || (_id as string).length <= 0) {
            return NextResponse.json({ message: 'Id is required' }, { status: 400 });
        }

        const data = await request.json();

        const parsedData = configSchema.safeParse(data);

        if (!parsedData.success) {
            return NextResponse.json(
                { message: 'Validation fail', error: parsedData.error.errors.map((e) => `${e.path} ${e.message}`.toLocaleLowerCase()).join(', ') },
                { status: 400 },
            );
        }

        const { key, value } = parsedData.data;

        await connectDB();

        const existingConfig = await ConfigModel.findOne({ key, _id: { $ne: _id } }).lean();
        if (existingConfig) {
            return NextResponse.json({ message: 'Key is already taken' }, { status: 400 });
        }

        const updatedData = await ConfigModel.findByIdAndUpdate(_id, { key, value }, { new: true, runValidators: true }).lean();

        if (!updatedData) {
            return NextResponse.json({ message: 'Config not found' }, { status: 404 });
        }

        await deleteCacheByPrefix('configs');

        revalidateTag(Constant.FOOTER_DATA_KEY);

        return NextResponse.json({ message: 'Config updated successfully', data: updatedData });
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
}
