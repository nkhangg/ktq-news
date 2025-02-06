import connectDB from '@/lib/mongoose';
import { LikeModel } from '@/models/like';
import { PostModel } from '@/models/post';
import { NextRequest, NextResponse } from 'next/server';

async function updatePostLikeCount(post_id: string, increment: number) {
    const result = await PostModel.findOneAndUpdate({ _id: post_id }, { $inc: { like_count: increment } }, { new: true, projection: { like_count: 1 } }).select('like_count');

    return result;
}

export async function GET(request: NextRequest) {
    try {
        const ipClient = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'undetermined';

        const { searchParams } = new URL(request.url);

        const post_id = searchParams.get('post_id');

        if (!post_id) {
            return NextResponse.json({ error: 'Not found data' }, { status: 404 });
        }
        const like = await LikeModel.findOne({ post: post_id, ip_client: ipClient }).populate('post', 'like_count', PostModel).select('-ip_client').lean();

        return NextResponse.json(like);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const WAITING_TIME = 2;

    try {
        await connectDB();

        const { post_id } = await request.json();

        const now = new Date();

        const ipClient = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'undetermined';

        const likeRecord = await LikeModel.findOne({ ip_client: ipClient, post: post_id });

        if (likeRecord) {
            const timeDiff = (now.getTime() - (likeRecord?.updatedAt || now).getTime()) / 1000;

            if (timeDiff < WAITING_TIME) {
                return NextResponse.json({ error: 'Please waiting to update' }, { status: 429 });
            }

            likeRecord.action = likeRecord.action === 'like' ? 'unlike' : 'like';
            likeRecord.updatedAt = now;
            await likeRecord.save();

            const post = await updatePostLikeCount(post_id, likeRecord.action === 'like' ? 1 : -1);

            return NextResponse.json({ message: `Action success ${likeRecord.action}`, current_like_count: post ? post.like_count : 0, action: likeRecord.action });
        }

        const result = await LikeModel.create({
            ip_client: ipClient,
            post: post_id,
            action: 'like',
        });
        const post = await updatePostLikeCount(post_id, 1);

        return NextResponse.json({ message: `Action success ${result.action}`, current_like_count: post ? post.like_count : 0, action: 'like' });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
