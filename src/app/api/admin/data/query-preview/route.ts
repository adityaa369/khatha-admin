import { proxyAdminMutation } from '@/lib/backendProxy';

export async function POST(request: Request) {
    return proxyAdminMutation('/api/admin/data/query-preview', 'POST', request);
}
