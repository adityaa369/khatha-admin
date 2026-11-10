import { proxyAdminMutation } from '@/lib/backendProxy';

export async function POST(request: Request) {
    return proxyAdminMutation('/api/admin/observability/keep-alive/ping', 'POST', request);
}
