export type StatusLevel = '🟢 Healthy' | '🟡 Attention' | '🟠 Degraded' | '🔴 Critical' | '🔴 Offline';
export interface DashboardMetrics {
    health: any;
    incidents: any[];
    killSwitchEnabled: boolean;
}
