"use client";
import React, { useState, useEffect } from 'react';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function ApiFailuresDashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [clearing, setClearing] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const fetchFailures = async () => {
        try {
            const res = await fetch('/api/admin/observability/api-failures');
            if (res.status === 401) {
                window.location.href = '/login';
                return;
            }
            const json = await res.json();
            if (json.success) {
                setData(json.data);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFailures();
        const interval = setInterval(fetchFailures, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleClear = async (mode: 'STALE_5XX_ONLY' | 'ALL_SECURITY_EVENTS') => {
        setClearing(true);
        setToast(null);
        try {
            const res = await fetch('/api/admin/observability/clear-telemetry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode }),
            });
            const json = await res.json();
            if (json.success) {
                setToast(json.message || 'Cleared stale telemetry events.');
                await fetchFailures();
            }
        } finally {
            setClearing(false);
        }
    };

    if (loading && !data) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading API failure traces...</div>;
    }

    const summary = data?.summary || {};
    const liveFailures = data?.liveFailures || [];
    const persistedEvents = data?.persistedEvents || [];

    return (
        <div className="p-6 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-amber-500 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">API Failures &amp; 5xx/4xx Root-Cause Trace Explorer</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Complete trace visibility into every failing request: Route, Method, HTTP Status, Actor, IP, Error Message &amp; Stack Summary
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            disabled={clearing}
                            onClick={() => handleClear('STALE_5XX_ONLY')}
                            className="px-3.5 py-2 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 disabled:opacity-50"
                        >
                            🧹 Clear Stale 5xx Spikes
                        </button>
                        <button
                            onClick={fetchFailures}
                            className="px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                        >
                            ↻ Refresh Traces
                        </button>
                    </div>
                </div>

                {toast && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-semibold">
                        ✅ {toast}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        title="Live 5xx Server Errors"
                        value={String(summary.total5xx ?? 0)}
                        status={(summary.total5xx || 0) === 0 ? '🟢 Healthy' : '🔴 Critical'}
                        explanation="Unhandled server errors in the current runtime window."
                    />
                    <MetricCard
                        title="Live 4xx Client Rejections"
                        value={String(summary.total4xx ?? 0)}
                        status="🟢 Healthy"
                        explanation="Validation, auth, or rate-limit rejections handled cleanly by the API."
                    />
                    <MetricCard
                        title="Captured Live Traces"
                        value={String(summary.liveFailureTracesCount ?? 0)}
                        status="🟢 Healthy"
                        explanation="Detailed failure traces buffered in memory with stack summaries."
                    />
                    <MetricCard
                        title="Persisted Security Spikes"
                        value={String(summary.persistedEventsCount ?? 0)}
                        status={(summary.persistedEventsCount || 0) === 0 ? '🟢 Healthy' : '🟡 Attention'}
                        explanation="Historical failure/spike records stored in MongoDB SecurityEvent collection."
                    />
                </div>

                {/* Live Captured Failure Traces */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                        <h2 className="text-base font-bold text-gray-900">1. Live Captured HTTP 5xx &amp; 4xx Failure Traces</h2>
                        <span className="text-xs text-gray-500 font-mono">Real-time ring buffer (last 200 failures)</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-white text-xs font-semibold text-gray-500 uppercase">
                                <tr>
                                    <th className="px-5 py-3 text-left">Timestamp</th>
                                    <th className="px-5 py-3 text-left">Status</th>
                                    <th className="px-5 py-3 text-left">Method &amp; Route</th>
                                    <th className="px-5 py-3 text-left">Actor</th>
                                    <th className="px-5 py-3 text-left">IP</th>
                                    <th className="px-5 py-3 text-left">Latency</th>
                                    <th className="px-5 py-3 text-left">Error Message &amp; Stack Trace</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-mono">
                                {liveFailures.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-emerald-700 font-sans font-semibold">
                                            🟢 Zero live API failures recorded since fix deployment.
                                        </td>
                                    </tr>
                                ) : (
                                    liveFailures.map((f: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-5 py-3.5 text-xs text-gray-500">{new Date(f.timestamp).toLocaleString()}</td>
                                            <td className="px-5 py-3.5">
                                                <StatusBadge
                                                    status={f.statusCode >= 500 ? '🔴 Critical' : '🟡 Attention'}
                                                    text={`HTTP ${f.statusCode}`}
                                                />
                                            </td>
                                            <td className="px-5 py-3.5 font-bold text-gray-900">
                                                {f.method} {f.route}
                                            </td>
                                            <td className="px-5 py-3.5 text-xs">
                                                {f.actorType}: {f.actorId}
                                            </td>
                                            <td className="px-5 py-3.5 text-xs">{f.ip}</td>
                                            <td className="px-5 py-3.5 text-xs">{f.durationMs} ms</td>
                                            <td className="px-5 py-3.5 font-sans">
                                                <div className="font-semibold text-red-700">{f.errorMessage}</div>
                                                {f.stackSummary && (
                                                    <div className="font-mono text-[11px] text-gray-500 mt-1">{f.stackSummary}</div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Persisted SecurityEvent Store */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                        <h2 className="text-base font-bold text-gray-900">2. Persisted Security Telemetry &amp; 5xx Spike Store</h2>
                        <span className="text-xs text-gray-500 font-mono">Enriched with root-cause attribution</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-white text-xs font-semibold text-gray-500 uppercase">
                                <tr>
                                    <th className="px-5 py-3 text-left">Timestamp</th>
                                    <th className="px-5 py-3 text-left">Event &amp; Severity</th>
                                    <th className="px-5 py-3 text-left">Actor</th>
                                    <th className="px-5 py-3 text-left">Target Route &amp; IP</th>
                                    <th className="px-5 py-3 text-left">Result</th>
                                    <th className="px-5 py-3 text-left">Root Cause / Trace Explanation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-mono">
                                {persistedEvents.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-emerald-700 font-sans font-semibold">
                                            🟢 Clean — No persisted failure spikes in MongoDB SecurityEvent store.
                                        </td>
                                    </tr>
                                ) : (
                                    persistedEvents.map((ev: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-5 py-3.5 text-xs text-gray-500">{new Date(ev.timestamp).toLocaleString()}</td>
                                            <td className="px-5 py-3.5">
                                                <div className="font-bold text-gray-900">{ev.eventType}</div>
                                                <div className="text-xs text-orange-600">{ev.severity}</div>
                                            </td>
                                            <td className="px-5 py-3.5 text-xs">
                                                <div>{ev.actorType}</div>
                                                <div className="text-gray-500">{ev.actorId}</div>
                                            </td>
                                            <td className="px-5 py-3.5 text-xs">
                                                <div className="font-bold text-gray-900">{ev.route}</div>
                                                <div className="text-gray-500">IP: {ev.ipReference}</div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <StatusBadge status="🟡 Attention" text={ev.result} />
                                            </td>
                                            <td className="px-5 py-3.5 font-sans text-xs">
                                                <div className="font-semibold text-gray-900">{ev.rootCause}</div>
                                                {ev.stackSummary && (
                                                    <div className="font-mono text-[11px] text-gray-500 mt-1">{ev.stackSummary}</div>
                                                )}
                                            </td>
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
