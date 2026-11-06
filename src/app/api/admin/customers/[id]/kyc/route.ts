import { proxyAdminMutation } from '@/lib/backendProxy';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return proxyAdminMutation(`/api/admin/customers/${encodeURIComponent(id)}/kyc/unmask`, 'POST', request);
}
