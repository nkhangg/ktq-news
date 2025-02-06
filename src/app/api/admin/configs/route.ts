import connectDB from '@/lib/mongoose';
import { ConfigModel } from '@/models/configs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);

        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const sortField = searchParams.get('sortField') || 'createdAt';
        const sortOrder = parseInt(searchParams.get('sortOrder') || '-1');

        const query: Record<string, unknown> = {};

        if (search) {
            query.$or = [{ value: { $regex: search, $options: 'i' } }, { key: { $regex: search, $options: 'i' } }];
        }

        const options = {
            page,
            limit,
            sort: { [sortField]: sortOrder },
            customLabels: {
                docs: 'data',
                totalDocs: 'total',
                limit: 'per_page',
                page: 'current_page',
                nextPage: 'from',
                prevPage: 'to',
                totalPages: 'last_page',
                hasPrevPage: 'has_prev_page',
                hasNextPage: 'has_next_page',
            },
        };

        const result = await ConfigModel['paginate'](query, options);

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
}
