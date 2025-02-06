import { getCache, setCache } from '@/lib/cache-service';
import connectDB from '@/lib/mongoose';
import { HistoryModel } from '@/models/history';
import { PostModel } from '@/models/post';
import { NextResponse } from 'next/server';

const CACHE_KEY = 'POST/OUTSTANDING';

// export async function GET() {
//     try {
//         await connectDB();

//         const cacheData = await getCache('outstanding');

//         if (cacheData) {
//             return NextResponse.json(JSON.parse(cacheData.value));
//         }

//         const popularPosts = await HistoryModel.aggregate([
//             {
//                 $group: {
//                     _id: '$post',
//                     viewCount: { $sum: 1 },
//                 },
//             },
//             {
//                 $sort: { viewCount: -1 },
//             },
//             {
//                 $limit: 10,
//             },
//             {
//                 $lookup: {
//                     from: 'posts',
//                     localField: '_id',
//                     foreignField: '_id',
//                     as: 'postDetails',
//                 },
//             },
//             {
//                 $unwind: '$postDetails',
//             },
//             {
//                 $lookup: {
//                     from: 'users',
//                     localField: 'postDetails.user',
//                     foreignField: '_id',
//                     as: 'userDetails',
//                 },
//             },
//             {
//                 $unwind: '$userDetails',
//             },
//             {
//                 $lookup: {
//                     from: 'categories',
//                     localField: 'postDetails.category',
//                     foreignField: '_id',
//                     as: 'categoryDetails',
//                 },
//             },
//             {
//                 $unwind: '$categoryDetails',
//             },
//             {
//                 $project: {
//                     _id: '$postDetails._id',
//                     thumbnail: '$postDetails.thumbnail',
//                     title: '$postDetails.title',
//                     content: '$postDetails.content',
//                     preview_content: '$postDetails.preview_content',
//                     user: {
//                         _id: '$userDetails._id',
//                         username: '$userDetails.username',
//                         email: '$userDetails.email',
//                         role: '$userDetails.role',
//                     },
//                     category: {
//                         _id: '$categoryDetails._id',
//                         name: '$categoryDetails.name',
//                         slug: '$categoryDetails.slug',
//                     },
//                     createdAt: '$postDetails.createdAt',
//                 },
//             },
//         ]);

//         if (popularPosts.length === 0) {
//             const latestPosts = await PostModel.find().sort({ createdAt: -1 }).limit(10).populate('user', '-password').populate('category');

//             return NextResponse.json(latestPosts);
//         }

//         await setCache('outstanding', JSON.stringify(popularPosts));

//         return NextResponse.json(popularPosts);
//     } catch (error) {
//         return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
//     }
// }
export async function GET() {
    try {
        await connectDB();

        const cacheData = await getCache(CACHE_KEY);

        if (cacheData) {
            return NextResponse.json(JSON.parse(cacheData.value));
        }

        const popularPosts = await HistoryModel.aggregate([
            {
                $group: {
                    _id: '$post',
                    viewCount: { $sum: 1 },
                },
            },
            {
                $sort: { viewCount: -1 },
            },
            {
                $limit: 10,
            },
            {
                $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'postDetails',
                },
            },
            {
                $unwind: '$postDetails',
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'postDetails.user',
                    foreignField: '_id',
                    as: 'userDetails',
                },
            },
            {
                $unwind: '$userDetails',
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'postDetails.category',
                    foreignField: '_id',
                    as: 'categoryDetails',
                },
            },
            {
                $unwind: '$categoryDetails',
            },
            {
                $project: {
                    _id: '$postDetails._id',
                    thumbnail: '$postDetails.thumbnail',
                    title: '$postDetails.title',
                    content: '$postDetails.content',
                    preview_content: '$postDetails.preview_content',
                    ttr: '$postDetails.ttr',
                    slug: '$postDetails.slug',
                    user: {
                        _id: '$userDetails._id',
                        username: '$userDetails.username',
                        fullname: '$userDetails.fullname',
                        email: '$userDetails.email',
                        role: '$userDetails.role',
                    },
                    category: {
                        _id: '$categoryDetails._id',
                        name: '$categoryDetails.name',
                        slug: '$categoryDetails.slug',
                    },
                    createdAt: '$postDetails.createdAt',
                },
            },
        ]);

        if (popularPosts.length === 0) {
            const latestPosts = await PostModel.aggregate([
                {
                    $sort: { createdAt: -1 },
                },
                {
                    $limit: 10,
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'userDetails',
                    },
                },
                {
                    $unwind: '$userDetails',
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as: 'categoryDetails',
                    },
                },
                {
                    $unwind: '$categoryDetails',
                },
                {
                    $project: {
                        _id: 1,
                        thumbnail: 1,
                        title: 1,
                        content: 1,
                        preview_content: 1,
                        ttr: 1,
                        slug: 1,
                        user: {
                            _id: '$userDetails._id',
                            fullname: '$userDetails.fullname',
                            username: '$userDetails.username',
                            email: '$userDetails.email',
                            role: '$userDetails.role',
                        },
                        category: {
                            _id: '$categoryDetails._id',
                            name: '$categoryDetails.name',
                            slug: '$categoryDetails.slug',
                        },
                        createdAt: 1,
                    },
                },
            ]);

            await setCache(CACHE_KEY, JSON.stringify(latestPosts));

            return NextResponse.json(latestPosts);
        }

        await setCache(CACHE_KEY, JSON.stringify(popularPosts), 30);

        return NextResponse.json(popularPosts);
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
}
