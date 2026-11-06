import { proxyAdminGet } from '@/lib/backendProxy';
export async function GET() { return proxyAdminGet('/api/admin/financial/ledger'); }
