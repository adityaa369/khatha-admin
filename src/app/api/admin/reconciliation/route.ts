import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BACKEND_API_URL } from '@/lib/backendProxy';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_session')?.value;
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
        const [ovRes, incRes, ledRes] = await Promise.all([
            fetch(`${BACKEND_API_URL}/api/admin/reconciliation/overview`, { headers, cache: 'no-store' }),
            fetch(`${BACKEND_API_URL}/api/admin/reconciliation/incidents`, { headers, cache: 'no-store' }),
            fetch(`${BACKEND_API_URL}/api/admin/financial/ledger`, { headers, cache: 'no-store' }),
        ]);

        if (ovRes.status === 401) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const ov = ovRes.ok ? await ovRes.json() : { data: {} };
        const inc = incRes.ok ? await incRes.json() : { data: [] };
        const led = ledRes.ok ? await ledRes.json() : { data: {} };

        return NextResponse.json({
            success: true,
            overview: ov.data || {},
            incidents: inc.data || [],
            ledger: led.data || {},
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error?.message || 'Internal Server Error' }, { status: 500 });
    }
}
