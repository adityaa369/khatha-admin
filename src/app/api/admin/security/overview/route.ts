import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_session')?.value;
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
        
        const res = await fetch(`${apiBaseUrl}/api/admin/security/overview`, { headers });
        if (!res.ok) return NextResponse.json({ success: false, message: 'Upstream API Error' }, { status: 502 });
        
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
