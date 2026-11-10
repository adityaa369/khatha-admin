"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MetricCard } from '@/components/ui/MetricCard';

export default function Dashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [lastVerified, setLastVerified] = useState<string | null>(null);

    const fetchDashboard = async () => {
        try {
            const res = await fetch('/api/admin/dashboard');
            if (res.status === 401) {
                window.location.href = '/login';
                return;
            }
            if (!res.ok) throw new Error('Failed to fetch');
            const json = await res.json();
            if (json.success) {
                setData(json.data);
                setError(false);
                setLastVerified(new Date().toLocaleTimeString());
            } else {
                throw new Error('API Error');
            }
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
        const interval = setInterval(fetchDashboard, 15000);
        return () => clearInterval(interval);
    }, []);

    const formatRupees = (paise: number) => {
        if (paise === null || paise === undefined) return 'Unknown';
        return '₹' + (paise / 100).toLocaleString('en-IN');
    };

    if (loading && !data) {
        return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading live operational telemetry...</div>;
    }

    const isHealthy = !error && data?.infrastructure?.database?.status === 'CONNECTED';
    const keepAlive = data?.infrastructure?.keepAlive;

    return (
        <div className="p-6 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white border rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">HandCredit Operational Command Center</h1>
                        <p className={'text-sm mt-1 font-medium ' + (error ? 'text-red-600' : isHealthy ? 'text-emerald-600' : 'text-yellow-600')}>
                            {error
                                ? '🔴 ATTENTION REQUIRED: Unable to reach backend systems.'
                                : isHealthy
                                  ? '🟢 HandCredit production systems are operating normally.'
                                  : '🟡 Infrastructure requires attention.'}
                        </p>
                    </div>
                    <div className="flex flex-col items-end mt-4 md:mt-0 space-y-2">
                        <div className="flex flex-wrap gap-2">
                            <span
                                className={
                                    'text-xs px-2.5 py-1 rounded-full font-semibold ' +
                                    (error ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800')
                                }
                            >
                                API: {error ? '🔴 Offline' : '🟢 Connected'}
                            </span>
                            <span
                                className={
                                    'text-xs px-2.5 py-1 rounded-full font-semibold ' +
                                    (error || data?.infrastructure?.database?.status !== 'CONNECTED'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-emerald-100 text-emerald-800')
                                }
                            >
                                MongoDB: {error || data?.infrastructure?.database?.status !== 'CONNECTED' ? '🔴 Offline' : '🟢 Connected'}
                            </span>
                            <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-blue-100 text-blue-800">
                                5m Keep-Alive: {keepAlive?.enabled !== false ? '🟢 Active' : '🟡 Standby'}
                            </span>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">Last verified: {lastVerified || 'Never'}</span>
                    </div>
                </div>

                {/* Platform & User Summary */}
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-6">LIVE PLATFORM & LEDGER METRICS</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        title="Registered Users"
                        value={error || data?.totalCustomers === undefined ? 'Unknown' : data.totalCustomers.toLocaleString('en-IN')}
                        explanation="Total registered accounts on HandCredit."
                        status={error ? '🔴 Offline' : '🟢 Healthy'}
                    />
                    <MetricCard
                        title="Active Credits"
                        value={error || data?.activeLoans === undefined ? 'Unknown' : data.activeLoans.toLocaleString('en-IN')}
                        explanation={`Currently active mutual credit agreements (Out of ${data?.totalLoans || 0} total).`}
                        status={error ? '🔴 Offline' : '🟢 Healthy'}
                    />
                    <MetricCard
                        title="Active Outstanding Balance"
                        value={error || data?.outstandingPaise === undefined ? 'Unknown' : formatRupees(data.outstandingPaise)}
                        explanation="Total unpaid balance across all active Hand, Business, and Interest credits."
                        status={error ? '🔴 Offline' : '🟢 Healthy'}
                    />
                    <MetricCard
                        title="Repayments Today"
                        value={error || data?.paymentsToday === undefined ? 'Unknown' : formatRupees(data.paymentsToday)}
                        explanation="Total value of all repayments recorded across the platform today."
                        status={error ? '🔴 Offline' : '🟢 Healthy'}
                    />
                </div>

                {/* Integrity & Safety */}
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-8">FINANCIAL INTEGRITY & INFRASTRUCTURE</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        title="Ledger Reconciliation"
                        value={error || data?.ledgerBalanced === null ? 'Unknown' : data.ledgerBalanced ? '₹0 Gap (Balanced)' : 'Discrepancy'}
                        status={error || data?.ledgerBalanced === null ? '🔴 Offline' : data.ledgerBalanced ? '🟢 Healthy' : '🔴 Critical'}
                        explanation="Difference between total system Debits and Credits. ₹0 means zero mathematical imbalance."
                    />
                    <MetricCard
                        title="Open Incidents"
                        value={error || data?.criticalIncidents === undefined ? 'Unknown' : String(data.openIncidents ?? data.criticalIncidents)}
                        status={error ? '🔴 Offline' : (data?.criticalIncidents || 0) === 0 ? '🟢 Healthy' : '🔴 Critical'}
                        explanation="Open financial reconciliation mismatches requiring operator investigation."
                    />
                    <MetricCard
                        title="Database Ping Latency"
                        value={error || !data?.infrastructure?.database ? 'Unknown' : `${data.infrastructure.database.latencyMs} ms`}
                        status={error || data?.infrastructure?.database?.status !== 'CONNECTED' ? '🔴 Offline' : '🟢 Healthy'}
                        explanation="Live round-trip PING latency from Render backend to MongoDB Atlas."
                    />
                    <MetricCard
                        title="Financial Kill Switch"
                        value={error || data?.killSwitchEnabled === undefined ? 'Unknown' : data.killSwitchEnabled ? 'ACTIVE (LOCKED)' : 'OFF (NORMAL)'}
                        status={error ? '🔴 Offline' : data?.killSwitchEnabled ? '🔴 Critical' : '🟢 Healthy'}
                        explanation="When ON, all credit creation and repayment mutations are paused across the platform."
                    />
                </div>

                {/* Quick Operator Navigation Cards */}
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-8">QUICK OPERATOR ACTIONS & SRE DASHBOARDS</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/database" className="bg-white border rounded-xl p-5 hover:border-emerald-500 hover:shadow-md transition block">
                        <div className="font-bold text-gray-900">Database Query &amp; User Purge Studio &rarr;</div>
                        <p className="text-xs text-gray-500 mt-1">
                            Query and delete specific user records or purge all user data while preserving schemas, indexes, and admins with zero server reload.
                        </p>
                    </Link>
                    <Link href="/observability/latency" className="bg-white border rounded-xl p-5 hover:border-blue-500 hover:shadow-md transition block">
                        <div className="font-bold text-blue-700">App Latency &amp; User Issues Dashboard &rarr;</div>
                        <p className="text-xs text-gray-500 mt-1">
                            Monitor P50/P95/P99 latency, slow requests (&ge; 250ms), per-route bottlenecks, stuck intents, and notification failures.
                        </p>
                    </Link>
                    <Link href="/observability/failures" className="bg-white border rounded-xl p-5 hover:border-amber-500 hover:shadow-md transition block">
                        <div className="font-bold text-amber-700">API Failures &amp; 5xx/4xx Trace Explorer &rarr;</div>
                        <p className="text-xs text-gray-500 mt-1">
                            Inspect exact failing routes, HTTP status codes, actor IDs, IP addresses, error messages, and stack trace summaries.
                        </p>
                    </Link>
                    <Link href="/customers" className="bg-white border rounded-xl p-5 hover:border-emerald-500 hover:shadow-md transition block">
                        <div className="font-bold text-gray-900">Manage Users &amp; Accounts &rarr;</div>
                        <p className="text-xs text-gray-500 mt-1">
                            Search registered users by phone/email, inspect credit history, verify email, suspend, or delete user data.
                        </p>
                    </Link>
                    <Link href="/financial/loans" className="bg-white border rounded-xl p-5 hover:border-emerald-500 hover:shadow-md transition block">
                        <div className="font-bold text-gray-900">Inspect Credits &amp; Agreements &rarr;</div>
                        <p className="text-xs text-gray-500 mt-1">
                            Monitor all Hand, Business, and Interest credits, repayment progress, and attached proof documents.
                        </p>
                    </Link>
                    <Link href="/emergency" className="bg-white border rounded-xl p-5 hover:border-red-500 hover:shadow-md transition block">
                        <div className="font-bold text-red-700">Emergency Financial Kill Switch &rarr;</div>
                        <p className="text-xs text-gray-500 mt-1">
                            Immediately freeze or resume platform-wide financial mutations with full audit trail.
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
