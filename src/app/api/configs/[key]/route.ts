import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { ConfigModel } from '@/models/configs';

export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);

        const key = searchParams.get('key') || '';

        const config = await ConfigModel.findOne({ key });

        if (!config) {
            return NextResponse.json({ error: 'Not found config' }, { status: 404 });
        }

        return NextResponse.json(config);
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
}
