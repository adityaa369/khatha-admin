"use client";
import React, { useState, useEffect } from 'react';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function LatencyAndUserIssuesPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchLatency = async () => {
        try {
            const res = await fetch('/api/admin/observability/latency-errors');
            if (res.status === 401) {
                window.location.href = '/login';
                return;
            }
            if (!res.ok) throw new Error('Failed');
            const json = await res.json();
            if (json.success) {
                setData(json.data);
                setError(false);
            }
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLatency();
        const interval = setInterval(fetchLatency, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !data) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading SRE latency &amp; user issues telemetry...</div>;
    }

    const lat = data?.latency || {};
    const issues = data?.userFacingIssues || {};
    const routes = data?.routeBreakdown || [];
    const slowRequests = data?.slowRequests || [];
    const keepAlive = data?.keepAlive || {};

    return (
        <div className="p-6 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">App Latency, Bottlenecks &amp; User-Facing Issues</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Real-time P50/P95/P99 latency, slow request traces (&ge; 250ms), per-route breakdown, and user friction telemetry
                        </p>
                    </div>
                    <button
                        onClick={fetchLatency}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                    >
                        ↻ Refresh Telemetry
                    </button>
                </div>

                {/* Top Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        title="Latency (P50 / P95 / P99)"
                        value={`${lat.p50Ms ?? 0} / ${lat.p95Ms ?? 0} / ${lat.p99Ms ?? 0} ms`}
                        status={(lat.p95Ms || 0) < 250 ? '🟢 Healthy' : '🟡 Attention'}
                        explanation="Rolling latency percentiles across the most recent 500 API requests."
                    />
                    <MetricCard
                        title="Stuck / Failed Intents"
                        value={String(issues.stuckOrFailedIntentsCount ?? 0)}
                        status={(issues.stuckOrFailedIntentsCount || 0) === 0 ? '🟢 Healthy' : '🔴 Critical'}
                        explanation="Financial mutation intents stuck in PENDING > 5 minutes or FAILED in the last 24 hours."
                    />
                    <MetricCard
                        title="Notification Outbox Failures"
                        value={String(issues.failedNotificationsCount ?? 0)}
                        status={(issues.failedNotificationsCount || 0) === 0 ? '🟢 Healthy' : '🟡 Attention'}
                        explanation="Push or email notifications in FAILED or DEAD_LETTER state."
                    />
                    <MetricCard
                        title="5-Min Keep-Alive Health"
                        value={keepAlive.lastStatus || 'HEALTHY'}
                        status="🟢 Healthy"
                        explanation={`Render anti-spin-down worker active (${keepAlive.totalPings ?? 1} probes completed).`}
                    />
                </div>

                {/* Per-Route Breakdown */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                        <h2 className="text-base font-bold text-gray-900">Per-Route Latency &amp; Error Breakdown</h2>
                        <span className="text-xs text-gray-500 font-mono">Sorted by 5xx/4xx errors &amp; P95 latency</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-white text-xs font-semibold text-gray-500 uppercase">
                                <tr>
                                    <th className="px-5 py-3 text-left">Route</th>
                                    <th className="px-5 py-3 text-left">Total Calls</th>
                                    <th className="px-5 py-3 text-left">5xx Errors</th>
                                    <th className="px-5 py-3 text-left">4xx Errors</th>
                                    <th className="px-5 py-3 text-left">Avg Latency</th>
                                    <th className="px-5 py-3 text-left">Max Latency</th>
                                    <th className="px-5 py-3 text-left">Last Error</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-mono">
                                {routes.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500 font-sans">
                                            No route traffic recorded in current window yet.
                                        </td>
                                    </tr>
                                ) : (
                                    routes.map((r: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-5 py-3.5 font-semibold text-gray-900">{r.route}</td>
                                            <td className="px-5 py-3.5">{r.total}</td>
                                            <td className="px-5 py-3.5">
                                                <StatusBadge
                                                    status={(r.errors5xx || r['5xx'] || 0) > 0 ? '🔴 Critical' : '🟢 Healthy'}
                                                    text={String(r.errors5xx ?? r['5xx'] ?? 0)}
                                                />
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <StatusBadge
                                                    status={(r.errors4xx || r['4xx'] || 0) > 0 ? '🟡 Attention' : '🟢 Healthy'}
                                                    text={String(r.errors4xx ?? r['4xx'] ?? 0)}
                                                />
                                            </td>
                                            <td className="px-5 py-3.5">{r.avgLatencyMs ?? r.avgMs ?? 0} ms</td>
                                            <td className="px-5 py-3.5">{r.maxLatencyMs ?? r.maxMs ?? 0} ms</td>
                                            <td className="px-5 py-3.5 text-xs text-red-600 font-sans">{r.lastErrorMessage || r.lastError || '—'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Slow Requests Trace */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                        <h2 className="text-base font-bold text-gray-900">Slow Requests Trace (&ge; 250ms)</h2>
                        <span className="text-xs text-gray-500 font-mono">Captures database or network latency spikes</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-white text-xs font-semibold text-gray-500 uppercase">
                                <tr>
                                    <th className="px-5 py-3 text-left">Timestamp</th>
                                    <th className="px-5 py-3 text-left">Method &amp; Route</th>
                                    <th className="px-5 py-3 text-left">Latency</th>
                                    <th className="px-5 py-3 text-left">HTTP Status</th>
                                    <th className="px-5 py-3 text-left">Actor</th>
                                    <th className="px-5 py-3 text-left">IP</th>
                                    <th className="px-5 py-3 text-left">Request ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-mono">
                                {slowRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-emerald-700 font-sans font-semibold">
                                            🟢 All recent requests completed in under 250ms.
                                        </td>
                                    </tr>
                                ) : (
                                    slowRequests.map((s: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-5 py-3.5 text-xs text-gray-500">{new Date(s.timestamp).toLocaleTimeString()}</td>
                                            <td className="px-5 py-3.5 font-semibold text-gray-900">
                                                {s.method} {s.route}
                                            </td>
                                            <td className="px-5 py-3.5 text-amber-700 font-bold">{s.durationMs} ms</td>
                                            <td className="px-5 py-3.5">{s.statusCode}</td>
                                            <td className="px-5 py-3.5 text-xs">{s.actorId}</td>
                                            <td className="px-5 py-3.5 text-xs">{s.ip}</td>
                                            <td className="px-5 py-3.5 text-xs text-gray-400">{String(s.requestId || '').slice(0, 12)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
