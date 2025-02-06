import Constant from '@/constants';
import connectDB from '@/lib/mongoose';
import { ConfigModel } from '@/models/configs';
import { NextResponse } from 'next/server';
export async function GET() {
    await connectDB();

    const configs: IConfig[] = await ConfigModel.find({
        key: { $in: [Constant.FOOTER_DATA_KEY, Constant.PRIMARY_EMAIL_KEY, Constant.DESCRIPTION_WEBSITE] },
    });
    return NextResponse.json(configs, { status: 200 });
}
