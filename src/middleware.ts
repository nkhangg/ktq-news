import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isAuthenticated } from './lib/jwt-token-control';
import Routes from './ultils/routes';

const EXCLUDE = ['admin/login'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (EXCLUDE.some((path) => pathname.includes(path))) {
        return NextResponse.next();
    }

    const token = request.cookies.get('Authorization')?.value;

    if (!token) {
        if (pathname.includes('api')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        } else {
            return NextResponse.redirect(new URL(Routes.LOGIN, request.url));
        }
    }

    const isAuthed = await isAuthenticated(request);

    if (isAuthed) {
        return NextResponse.next();
    }

    if (pathname.includes('api')) {
        return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    } else {
        return NextResponse.redirect(new URL(Routes.LOGIN, request.url));
    }
}

export const config = {
    matcher: ['/api/admin/:path*', '/admin/:path'],
};
