import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BACKEND_API_URL } from '@/lib/backendProxy';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_session')?.value;
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
        const [adminsRes, auditRes, readinessRes] = await Promise.all([
            fetch(`${BACKEND_API_URL}/api/admin/system/admins`, { headers, cache: 'no-store' }),
            fetch(`${BACKEND_API_URL}/api/admin/system/audit`, { headers, cache: 'no-store' }),
            fetch(`${BACKEND_API_URL}/api/admin/system/readiness`, { headers, cache: 'no-store' }),
        ]);

        if (adminsRes.status === 401) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const adminsJson = adminsRes.ok ? await adminsRes.json() : { data: [] };
        const auditJson = auditRes.ok ? await auditRes.json() : { data: [] };
        const readinessJson = readinessRes.ok ? await readinessRes.json() : { data: null };

        return NextResponse.json({
            success: true,
            admins: adminsJson.data || [],
            auditLogs: auditJson.data || [],
            readiness: readinessJson.data || null,
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error?.message || 'Internal Server Error' }, { status: 500 });
    }
}
