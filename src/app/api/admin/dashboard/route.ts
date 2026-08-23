
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_session')?.value;
        
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }
        
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
        
        // Aggregate data from real backend contracts
        const [dashRes, finRes, reconRes] = await Promise.all([
            fetch(`${apiBaseUrl}/api/admin/dashboard`, { headers }),
            fetch(`${apiBaseUrl}/api/admin/financial/overview`, { headers }),
            fetch(`${apiBaseUrl}/api/admin/reconciliation/overview`, { headers })
        ]);
        
        if (!dashRes.ok || !finRes.ok || !reconRes.ok) {
            return NextResponse.json({ success: false, message: 'Upstream API Error' }, { status: 502 });
        }
        
        const dashData = await dashRes.json();
        const finData = await finRes.json();
        const reconData = await reconRes.json();
        
        // Format for the UI
        return NextResponse.json({
            success: true,
            data: {
                paymentsToday: finData.data?.paymentsTodayPaise || 0,
                activeLoans: finData.data?.activeLoans || 0,
                ledgerBalanced: reconData.data?.ledgerBalanced ?? null,
                criticalIncidents: reconData.data?.criticalIncidents || 0,
                killSwitchEnabled: dashData.killSwitchEnabled,
                health: dashData.health || null
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
