import connectDB from '@/lib/mongoose';
import { ConfigModel } from '@/models/configs';
import { NextResponse } from 'next/server';
// To handle a GET request to /api

export async function GET() {
    await connectDB();

    const configs: IConfig[] = await ConfigModel.find({});
    return NextResponse.json(configs, { status: 200 });
}

export async function POST(request: Request) {
    try {
        await connectDB();

        const configs = await request.json();

        if (Array.isArray(configs)) {
            const updatePromises = configs.map(async (config) => {
                const { key, value, data } = config;

                const existingConfig = await ConfigModel.findOne({ key });

                if (existingConfig) {
                    return ConfigModel.findOneAndUpdate({ key }, { $set: { value, data } }, { new: true });
                } else {
                    return new ConfigModel({ key, value, data }).save();
                }
            });

            const result = await Promise.all(updatePromises);

            return NextResponse.json(result);
        } else {
            return NextResponse.json({ error: 'Data must be object' }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
}
