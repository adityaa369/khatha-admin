import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BACKEND_API_URL } from '@/lib/backendProxy';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_session')?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

        const [dashRes, finRes, reconRes, custRes] = await Promise.all([
            fetch(`${BACKEND_API_URL}/api/admin/dashboard`, { headers, cache: 'no-store' }),
            fetch(`${BACKEND_API_URL}/api/admin/financial/overview`, { headers, cache: 'no-store' }),
            fetch(`${BACKEND_API_URL}/api/admin/reconciliation/overview`, { headers, cache: 'no-store' }),
            fetch(`${BACKEND_API_URL}/api/admin/customers/overview`, { headers, cache: 'no-store' }),
        ]);

        if (dashRes.status === 401 || finRes.status === 401 || reconRes.status === 401) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        if (!dashRes.ok || !finRes.ok || !reconRes.ok) {
            return NextResponse.json({ success: false, message: 'Upstream API Error' }, { status: 502 });
        }

        const dashData = await dashRes.json();
        const finData = await finRes.json();
        const reconData = await reconRes.json();
        const custData = custRes.ok ? await custRes.json() : { data: {} };

        return NextResponse.json({
            success: true,
            data: {
                paymentsToday: finData.data?.paymentsTodayPaise || 0,
                paymentsCount: finData.data?.paymentsCount || 0,
                activeLoans: finData.data?.activeLoans || 0,
                totalLoans: finData.data?.totalLoans || 0,
                completedLoans: finData.data?.completedLoans || 0,
                pendingLoans: finData.data?.pendingLoans || 0,
                outstandingPaise: finData.data?.outstandingPaise || 0,
                totalCustomers: custData.data?.totalCustomers || 0,
                activeCustomers: custData.data?.active || 0,
                ledgerBalanced: reconData.data?.ledgerBalanced ?? true,
                criticalIncidents: reconData.data?.criticalIncidents || 0,
                openIncidents: reconData.data?.openIncidents || 0,
                killSwitchEnabled: dashData.killSwitchEnabled,
                health: dashData.health || null,
                infrastructure: dashData.infrastructure || null,
            },
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
