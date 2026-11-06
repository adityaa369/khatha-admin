import { proxyAdminGet } from '@/lib/backendProxy';
export async function GET() { return proxyAdminGet('/api/admin/security/overview'); }
