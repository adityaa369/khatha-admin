import { NextResponse } from 'next/server';
import { BACKEND_API_URL } from '@/lib/backendProxy';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const response = await fetch(`${BACKEND_API_URL}/api/admin/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            cache: 'no-store',
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            return NextResponse.json(
                { success: false, message: data.message || 'Login failed' },
                { status: 401 }
            );
        }

        const res = NextResponse.json({ success: true, admin: data.admin || null });
        res.cookies.set('admin_session', data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 8 * 3600, // 8 hours
        });

        return res;
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
