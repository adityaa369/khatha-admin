import { proxyAdminGet, proxyAdminMutation } from '@/lib/backendProxy';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return proxyAdminGet(`/api/admin/customers/${encodeURIComponent(id)}`);
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return proxyAdminMutation(`/api/admin/customers/${encodeURIComponent(id)}`, 'DELETE', request);
}
