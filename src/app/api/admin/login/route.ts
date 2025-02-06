import connectDB from '@/lib/mongoose';
import { UserModel } from '@/models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || '';

const EXPIRES_IN = 60 * 60 * 24;

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ message: 'Username or password is required' }, { status: 400 });
        }

        await connectDB();

        const admin = await UserModel.findOne({ username, role: 'admin' }).lean();

        if (!admin) {
            return NextResponse.json({ message: 'Username or password incorrect' }, { status: 400 });
        }

        const isPassword = await bcrypt.compare(password, admin.password);

        if (!isPassword) {
            return NextResponse.json({ message: 'Username or password incorrect' }, { status: 400 });
        }

        const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: EXPIRES_IN });
        const response = NextResponse.json({ message: 'Login success', data: true }, { status: 200 });

        response.cookies.set('Authorization', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: EXPIRES_IN,
            path: '/',
        });

        return response;
    } catch (error) {
        return NextResponse.json({ message: (error as Record<string, string>).message }, { status: 500 });
    }
}
