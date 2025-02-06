import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const mailSchema = z.object({
    to: z.string().min(1, 'To is required'),
    name: z.string().optional(),
    text: z.string().min(1, 'Text is required'),
});

export async function POST(req: NextRequest) {
    const data = await req.json();

    const parsedData = mailSchema.safeParse(data);

    if (!parsedData.success) {
        return NextResponse.json(
            { message: 'Validation fail', error: parsedData.error.errors.map((e) => `${e.path} ${e.message}`.toLocaleLowerCase()).join(', ') },
            { status: 400 },
        );
    }

    const { to, name, text } = parsedData.data;

    const subject = `Contact From KTQ News with sender ${name || 'No name'}`;

    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT || '', 10),
        secure: false,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.MAIL_FROM_ADDRESS,
            to,
            subject,
            text,
        });

        return new Response(JSON.stringify({ message: 'Cảm ơn bạn quan tâm đến chúng tôi. Chúng tôi sẽ phản lại trong thời gian sớm nhất ❤️', data: true }), { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(JSON.stringify({ message: 'Có lỗi xảy ra. Vui lòng thử lại', data: false }), { status: 500 });
    }
}
