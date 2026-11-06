import { proxyAdminGet, proxyAdminMutation } from '@/lib/backendProxy';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return proxyAdminGet(`/api/admin/reconciliation/incidents/${encodeURIComponent(id)}`);
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return proxyAdminMutation(`/api/admin/reconciliation/incidents/${encodeURIComponent(id)}/workflow`, 'PUT', request);
}
