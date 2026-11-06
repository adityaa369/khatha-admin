import { proxyAdminGet } from '@/lib/backendProxy';
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    return proxyAdminGet('/api/admin/security/investigate', searchParams);
}
