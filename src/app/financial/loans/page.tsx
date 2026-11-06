"use client";
import React, { useState, useEffect } from 'react';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function LoanOperations() {
    const [loans, setLoans] = useState<any[]>([]);
    const [summary, setSummary] = useState<Record<string, number>>({});
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [loading, setLoading] = useState(true);

    const fetchLoans = async (status = statusFilter, type = typeFilter) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (status !== 'ALL') params.set('status', status);
            if (type !== 'ALL') params.set('type', type);
            const res = await fetch(`/api/admin/financial/loans-list?${params.toString()}`);
            if (res.status === 401) {
                window.location.href = '/login';
                return;
            }
            const json = await res.json();
            if (json.success) {
                setLoans(json.loans || json.data || []);
                const map: Record<string, number> = {};
                (json.summary || []).forEach((s: any) => {
                    map[s._id] = s.count;
                });
                setSummary(map);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    const formatRupees = (paise: number) => '₹' + ((paise || 0) / 100).toLocaleString('en-IN');

    return (
        <div className="p-6 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Credits & Mutual Agreements Explorer</h1>
                        <p className="text-sm text-gray-600">
                            Read-only live view of all Hand Credits, Business Credits, and Interest Credits
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                fetchLoans(e.target.value, typeFilter);
                            }}
                            className="border rounded-lg px-3 py-2 text-sm bg-white text-gray-800"
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="pending_approval">Pending Approval</option>
                            <option value="completed">Completed / Closed</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <select
                            value={typeFilter}
                            onChange={(e) => {
                                setTypeFilter(e.target.value);
                                fetchLoans(statusFilter, e.target.value);
                            }}
                            className="border rounded-lg px-3 py-2 text-sm bg-white text-gray-800"
                        >
                            <option value="ALL">All Credit Types</option>
                            <option value="hand_credit">Hand Credit</option>
                            <option value="business_credit">Business Credit</option>
                            <option value="interest_credit">Interest Credit</option>
                        </select>
                    </div>
                </div>

                {/* Live Status Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        title="Active Credits"
                        value={Number(summary['active'] || 0).toLocaleString('en-IN')}
                        status="🟢 Healthy"
                    />
                    <MetricCard
                        title="Pending Counterparty Approval"
                        value={Number(summary['pending_approval'] || 0).toLocaleString('en-IN')}
                        status={(summary['pending_approval'] || 0) > 0 ? '🟡 Attention' : '🟢 Healthy'}
                    />
                    <MetricCard
                        title="Completed & Settled"
                        value={Number((summary['completed'] || 0) + (summary['closed'] || 0)).toLocaleString('en-IN')}
                        status="🟢 Healthy"
                    />
                    <MetricCard
                        title="Rejected / Cancelled"
                        value={Number(summary['rejected'] || 0).toLocaleString('en-IN')}
                    />
                </div>

                {/* Live Credits Table */}
                <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                            <tr>
                                <th className="px-5 py-3.5 text-left">Ref ID</th>
                                <th className="px-5 py-3.5 text-left">Type</th>
                                <th className="px-5 py-3.5 text-left">Creditor (Lender)</th>
                                <th className="px-5 py-3.5 text-left">Counterparty (Borrower)</th>
                                <th className="px-5 py-3.5 text-left">Principal</th>
                                <th className="px-5 py-3.5 text-left">Paid</th>
                                <th className="px-5 py-3.5 text-left">Remaining</th>
                                <th className="px-5 py-3.5 text-left">Docs</th>
                                <th className="px-5 py-3.5 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                                        Loading live credit agreements...
                                    </td>
                                </tr>
                            ) : loans.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                                        No credit records match the selected filter.
                                    </td>
                                </tr>
                            ) : (
                                loans.map((l) => (
                                    <tr key={l._id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4 font-mono font-bold text-gray-900">
                                            HC-{String(l._id).slice(-8).toUpperCase()}
                                        </td>
                                        <td className="px-5 py-4 text-xs font-semibold uppercase text-gray-700">
                                            {String(l.loanType || 'hand_credit').replace('_', ' ')}
                                            {l.interestRate > 0 ? ` (${l.interestRate}%)` : ''}
                                        </td>
                                        <td className="px-5 py-4 text-gray-800">{l.lenderName || l.lender}</td>
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-gray-900">{l.borrowerName}</div>
                                            <div className="text-xs text-gray-500 font-mono">+91 {l.borrowerPhone}</div>
                                        </td>
                                        <td className="px-5 py-4 font-mono font-semibold text-gray-900">
                                            {formatRupees(l.amountPaise)}
                                        </td>
                                        <td className="px-5 py-4 font-mono text-emerald-700">
                                            {formatRupees(l.paidAmountPaise)}
                                        </td>
                                        <td className="px-5 py-4 font-mono text-gray-800">
                                            {formatRupees(l.outstandingPaise)}
                                        </td>
                                        <td className="px-5 py-4 text-xs font-mono text-gray-600">
                                            {l.documentCount || 0} file(s)
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge
                                                status={
                                                    l.status === 'active' || l.status === 'completed'
                                                        ? '🟢 Healthy'
                                                        : l.status === 'pending_approval'
                                                          ? '🟡 Attention'
                                                          : '🔴 Critical'
                                                }
                                                text={String(l.status).toUpperCase()}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
