import { uploadImage } from '@/lib/cloudinary';
import connectDB from '@/lib/mongoose';
import { MediaModel } from '@/models/media';
import { downloadImage, isValidUrl } from '@/ultils/app';
import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';

const TMP_FOLDER = '/tmp';

const generateFileName = () => {
    return path.join(TMP_FOLDER, `media_upload_${Date.now()}.jpg`);
};

async function resizeImage(inputPath: string, outputPath: string, width: number, height: number) {
    await sharp(inputPath).resize(width, height).toFile(outputPath);
}

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
            query.$or = [
                { 'cloud_data.url': { $regex: search, $options: 'i' } },
                { 'cloud_data.format': { $regex: search, $options: 'i' } },
                { 'cloud_data.metadata': { $regex: search, $options: 'i' } },
                { 'cloud_data.asset_id': { $regex: search, $options: 'i' } },
                { 'cloud_data.public_id': { $regex: search, $options: 'i' } },
                { 'cloud_data.original_filename': { $regex: search, $options: 'i' } },
            ];
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
            select: '-cloud_data.api_key',
        };

        const result = await MediaModel['paginate'](query, options);

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: (error as Record<string, string>).message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const file = data.get('file') as File;

        const link = data.get('link') as string;

        if (!file && !link) {
            return NextResponse.json({ error: 'File or Link is required' }, { status: 400 });
        }

        await connectDB();
        const tempFilePath = generateFileName();

        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());

            const resizedBuffer = await sharp(buffer).resize(400).toBuffer();

            fs.writeFileSync(tempFilePath, resizedBuffer);

            const result = await uploadImage(tempFilePath);

            const collection = await MediaModel.create({
                cloud_data: result,
            });

            fs.unlinkSync(tempFilePath);

            return NextResponse.json({ message: 'Upload successful', data: collection });
        }

        if (link) {
            if (!isValidUrl(link)) return NextResponse.json({ message: 'Link must be url', data: null });

            const tempFilePath = generateFileName();
            const resizedFilePath = path.join(TMP_FOLDER, `resized_media_upload_${Date.now()}.jpg`);

            await downloadImage(link, tempFilePath);

            await resizeImage(tempFilePath, resizedFilePath, 400, 400);

            const result = await uploadImage(resizedFilePath);

            const collection = await MediaModel.create({
                cloud_data: result,
            });

            fs.unlinkSync(tempFilePath);
            fs.unlinkSync(resizedFilePath);

            return NextResponse.json({ message: 'Upload successful', data: collection });
        }

        return NextResponse.json({ error: 'Data is null' }, { status: 400 });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
    }
}
