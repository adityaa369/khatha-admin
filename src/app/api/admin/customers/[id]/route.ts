import { proxyAdminGet } from '@/lib/backendProxy';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return proxyAdminGet(`/api/admin/customers/${encodeURIComponent(id)}`);
}
