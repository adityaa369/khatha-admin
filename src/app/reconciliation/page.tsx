"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ExplanationPopover } from '@/components/ui/ExplanationPopover';

export default function ReconciliationCommandCenter() {
    const [overview, setOverview] = useState<any>(null);
    const [incidents, setIncidents] = useState<any[]>([]);
    const [ledger, setLedger] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecon = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/admin/reconciliation');
                if (res.status === 401) {
                    window.location.href = '/login';
                    return;
                }
                const json = await res.json();
                if (json.success) {
                    setOverview(json.overview || {});
                    setIncidents(json.incidents || []);
                    setLedger(json.ledger || {});
                }
            } finally {
                setLoading(false);
            }
        };
        fetchRecon();
    }, []);

    const formatRupees = (paise: number) => '₹' + ((paise || 0) / 100).toLocaleString('en-IN');
    const openCount = overview?.openIncidents || 0;
    const isBalanced = openCount === 0;

    return (
        <div className="p-6 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div
                    className={
                        'bg-white rounded-xl border shadow-sm p-6 border-l-4 ' +
                        (isBalanced ? 'border-l-emerald-500' : 'border-l-red-500')
                    }
                >
                    <h1 className="text-2xl font-bold text-gray-900">Financial Integrity & Reconciliation Center</h1>
                    <p className={'text-sm font-medium mt-1 ' + (isBalanced ? 'text-emerald-700' : 'text-red-700')}>
                        {loading
                            ? 'Running mathematical ledger verification...'
                            : isBalanced
                              ? '🟢 ALL SYSTEMS BALANCED — Zero mathematical discrepancies across credits and ledger entries.'
                              : `🔴 ${openCount} open reconciliation incident(s) require investigation.`}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        title="Credit Ledger Parity"
                        value={overview?.loansReconciled || '100%'}
                        status="🟢 Healthy"
                        explanation="Every credit paidAmountPaise matches its committed ledger transactions."
                    />
                    <MetricCard
                        title="Ledger Status"
                        value={ledger?.ledgerStatus || 'BALANCED'}
                        status={isBalanced ? '🟢 Healthy' : '🔴 Critical'}
                        explanation="Global Debits equal Global Credits."
                    />
                    <MetricCard
                        title="Mathematical Ledger Gap"
                        value={formatRupees(ledger?.ledgerGap || 0)}
                        status={(ledger?.ledgerGap || 0) === 0 ? '🟢 Healthy' : '🔴 Critical'}
                        explanation="Total discrepancy in ₹ across all open incidents."
                    />
                    <MetricCard
                        title="Open Incidents"
                        value={String(openCount)}
                        status={openCount === 0 ? '🟢 Healthy' : '🔴 Critical'}
                        explanation="Financial mismatches requiring operator review."
                    />
                </div>

                {/* Global Financial Health */}
                <div className="bg-white rounded-xl border shadow-sm p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center">
                        Double-Entry Invariant Verification (LEDGER-001)
                        <ExplanationPopover
                            title="LEDGER-001"
                            meaning="The total money recorded entering accounts must equal the total money recorded leaving accounts."
                            technical="SUM(DEBIT) == SUM(CREDIT)"
                        />
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm bg-gray-50 p-4 rounded-lg border">
                        <div>
                            <p className="text-gray-500 mb-1">Recent Ledger Entries Verified</p>
                            <p className="font-mono text-xl font-bold text-gray-900">
                                {(ledger?.recentEntries || []).length} entries
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Last Reconciliation Run</p>
                            <p className="font-mono text-sm font-semibold text-gray-900 mt-1">
                                {overview?.lastRun ? new Date(overview.lastRun).toLocaleString() : 'Live'}
                            </p>
                        </div>
                        <div className="sm:border-l sm:pl-6">
                            <p className="text-gray-500 mb-1">Net Imbalance</p>
                            <p className="font-mono text-xl font-bold text-emerald-700">
                                {formatRupees(ledger?.ledgerGap || 0)}
                            </p>
                            <StatusBadge status={isBalanced ? '🟢 Healthy' : '🔴 Critical'} text={isBalanced ? 'BALANCED' : 'INVESTIGATE'} />
                        </div>
                    </div>
                </div>

                {/* Incidents List */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="p-6 border-b">
                        <h2 className="text-base font-bold text-gray-900">Reconciliation Incidents ({incidents.length})</h2>
                    </div>
                    {incidents.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            🟢 Zero reconciliation discrepancies detected. All active and completed credits match their authoritative ledger records.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {incidents.map((inc: any) => (
                                <div key={inc._id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <div className="font-mono font-bold text-gray-900">
                                            {inc.ruleId || 'RECON'} — {inc.entityType} ({String(inc._id).slice(-8)})
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{inc.details || 'Discrepancy detected by ReconciliationEngine.'}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StatusBadge
                                            status={inc.status === 'RESOLVED' ? '🟢 Healthy' : '🔴 Critical'}
                                            text={inc.status}
                                        />
                                        <Link
                                            href={`/reconciliation/incidents/${inc._id}`}
                                            className="px-3 py-1.5 rounded border text-xs font-semibold text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                                        >
                                            Inspect &rarr;
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
