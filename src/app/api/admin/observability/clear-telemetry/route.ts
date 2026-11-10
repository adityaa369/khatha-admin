import { proxyAdminMutation } from '@/lib/backendProxy';

export async function POST(request: Request) {
    return proxyAdminMutation('/api/admin/observability/clear-telemetry', 'POST', request);
}
