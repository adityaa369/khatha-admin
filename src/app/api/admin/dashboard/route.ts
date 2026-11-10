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
            fetch(`${BACKEND_API_URL}/api/admin/financial/overview`, { headers, cache: 'no-store' }).catch(() => null),
            fetch(`${BACKEND_API_URL}/api/admin/reconciliation/overview`, { headers, cache: 'no-store' }).catch(() => null),
            fetch(`${BACKEND_API_URL}/api/admin/customers/overview`, { headers, cache: 'no-store' }).catch(() => null),
        ]);

        if (dashRes.status === 401) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        if (!dashRes.ok) {
            return NextResponse.json({ success: false, message: 'Upstream API Error' }, { status: 502 });
        }

        const dashData = await dashRes.json();
        const finData = finRes && finRes.ok ? await finRes.json().catch(() => ({})) : {};
        const reconData = reconRes && reconRes.ok ? await reconRes.json().catch(() => ({})) : {};
        const custData = custRes && custRes.ok ? await custRes.json().catch(() => ({})) : {};

        const p = dashData.platform || dashData.data || dashData;

        return NextResponse.json({
            success: true,
            data: {
                paymentsToday: finData.data?.paymentsTodayPaise ?? p.paymentsTodayPaise ?? 0,
                paymentsCount: finData.data?.paymentsCount ?? p.paymentsCount ?? 0,
                activeLoans: finData.data?.activeLoans ?? p.activeLoans ?? p.activeCredits ?? 0,
                totalLoans: finData.data?.totalLoans ?? p.totalLoans ?? 0,
                completedLoans: finData.data?.completedLoans ?? 0,
                pendingLoans: finData.data?.pendingLoans ?? 0,
                outstandingPaise: finData.data?.outstandingPaise ?? p.outstandingPaise ?? 0,
                totalCustomers: custData.data?.totalCustomers ?? p.registeredUsers ?? p.totalUsers ?? 0,
                activeCustomers: custData.data?.active ?? p.registeredUsers ?? 0,
                ledgerBalanced: reconData.data?.ledgerBalanced ?? p.ledgerBalanced ?? true,
                criticalIncidents: reconData.data?.criticalIncidents ?? p.openIncidents ?? 0,
                openIncidents: reconData.data?.openIncidents ?? p.openIncidents ?? 0,
                killSwitchEnabled: Boolean(dashData.killSwitchEnabled ?? p.killSwitchEnabled),
                health: dashData.health || null,
                infrastructure: dashData.infrastructure || null,
            },
        });
    } catch {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
