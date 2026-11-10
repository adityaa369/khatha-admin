import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const BACKEND_API_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    'https://khataa-backend.onrender.com';

export async function proxyAdminGet(endpoint: string, searchParams?: URLSearchParams) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_session')?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const qs = searchParams ? searchParams.toString() : '';
        const url = `${BACKEND_API_URL}${endpoint}${qs ? `?${qs}` : ''}`;

        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        const data = await res.json().catch(() => ({ success: false, message: 'Invalid JSON from upstream' }));
        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error?.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function proxyAdminMutation(endpoint: string, method: 'POST' | 'PUT' | 'DELETE', request?: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_session')?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        let bodyStr: string | undefined = undefined;
        if (request && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
            const body = await request.json().catch(() => null);
            if (body) bodyStr = JSON.stringify(body);
        }

        const res = await fetch(`${BACKEND_API_URL}${endpoint}`, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: bodyStr,
            cache: 'no-store',
        });

        const data = await res.json().catch(() => ({ success: false, message: 'Invalid JSON from upstream' }));
        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error?.message || 'Internal Server Error' }, { status: 500 });
    }
}
