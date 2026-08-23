const fs = require('fs');
const path = require('path');

// 1. src/app/api/admin/login/route.ts
const loginRoute = `
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        
        const response = await fetch(\`\${apiBaseUrl}/api/admin/auth/login\`, {
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
`;
fs.writeFileSync(path.join(__dirname, 'src/app/api/admin/login/route.ts'), loginRoute);

// 2. src/app/api/admin/logout/route.ts
const logoutRoute = `
import { NextResponse } from 'next/server';

export async function POST() {
    const res = NextResponse.json({ success: true });
    res.cookies.set('admin_session', '', { maxAge: 0, path: '/' });
    return res;
}
`;
fs.writeFileSync(path.join(__dirname, 'src/app/api/admin/logout/route.ts'), logoutRoute);

// 3. src/app/api/admin/session/route.ts
const sessionRoute = `
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session');
    
    if (!token) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    
    return NextResponse.json({ authenticated: true });
}
`;
fs.writeFileSync(path.join(__dirname, 'src/app/api/admin/session/route.ts'), sessionRoute);

// 4. src/app/api/admin/dashboard/route.ts (The BFF Aggregator)
const dashboardRoute = `
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
        const headers = { 'Authorization': \`Bearer \${token}\`, 'Content-Type': 'application/json' };
        
        // Aggregate data from real backend contracts
        const [dashRes, finRes, reconRes] = await Promise.all([
            fetch(\`\${apiBaseUrl}/api/admin/dashboard\`, { headers }),
            fetch(\`\${apiBaseUrl}/api/admin/financial/overview\`, { headers }),
            fetch(\`\${apiBaseUrl}/api/admin/reconciliation/overview\`, { headers })
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
`;
fs.writeFileSync(path.join(__dirname, 'src/app/api/admin/dashboard/route.ts'), dashboardRoute);

console.log("BFF API Routes generated.");
