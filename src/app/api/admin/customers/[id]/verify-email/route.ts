import { proxyAdminMutation } from '@/lib/backendProxy';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return proxyAdminMutation(`/api/admin/customers/${encodeURIComponent(id)}/verify-email`, 'PUT', request);
}
