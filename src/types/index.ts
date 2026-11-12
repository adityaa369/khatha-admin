export type StatusLevel = '🟢 Healthy' | '🟡 Attention' | '🟠 Degraded' | '🔴 Critical' | '🔴 Offline' | '⚪ Unverified';
export interface DashboardMetrics {
    health: any;
    incidents: any[];
    killSwitchEnabled: boolean;
}
