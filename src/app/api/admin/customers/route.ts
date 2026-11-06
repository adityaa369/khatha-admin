import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BACKEND_API_URL } from '@/lib/backendProxy';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_session')?.value;
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const qs = searchParams.toString();
        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

        const [overviewRes, listRes] = await Promise.all([
            fetch(`${BACKEND_API_URL}/api/admin/customers/overview`, { headers, cache: 'no-store' }),
            fetch(`${BACKEND_API_URL}/api/admin/customers${qs ? `?${qs}` : ''}`, { headers, cache: 'no-store' }),
        ]);

        if (overviewRes.status === 401 || listRes.status === 401) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const overviewJson = overviewRes.ok ? await overviewRes.json() : { data: {} };
        const listJson = listRes.ok ? await listRes.json() : { data: [] };

        return NextResponse.json({
            success: true,
            overview: overviewJson.data || {},
            customers: listJson.data || listJson.users || [],
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error?.message || 'Internal Server Error' }, { status: 500 });
    }
}
