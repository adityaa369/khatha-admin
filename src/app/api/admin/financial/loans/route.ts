import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_session')?.value;
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        const endpoint = '/api/admin/financial/loans';
        
        const res = await fetch(`${apiBaseUrl}${endpoint}`, { 
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
