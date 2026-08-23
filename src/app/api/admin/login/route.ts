
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        
        const response = await fetch(`${apiBaseUrl}/api/admin/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            return NextResponse.json({ success: false, message: data.message || 'Login failed' }, { status: 401 });
        }
        
        const res = NextResponse.json({ success: true });
        // Set HttpOnly Secure session cookie
        res.cookies.set('admin_session', data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 3600 // 1 hour
        });
        
        return res;
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
