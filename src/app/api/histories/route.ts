import connectDB from '@/lib/mongoose';
import { HistoryModel } from '@/models/history';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        await connectDB();

        const data = await request.json();

        const ipClient = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'undetermined';
        if (!data) return NextResponse.json({ error: 'Data is null' }, { status: 400 });

        const history = await HistoryModel.findOneAndUpdate({ ip_client: ipClient, post: data.post_id }, { ...data }, { upsert: true, new: true });

        if (!history) return NextResponse.json({ error: "Can't found data or insert" }, { status: 400 });

        return NextResponse.json(history, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
}
