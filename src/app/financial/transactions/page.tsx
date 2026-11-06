"use client";
import React, { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function TransactionExplorer() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTx = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/admin/financial/transactions');
                if (res.status === 401) {
                    window.location.href = '/login';
                    return;
                }
                const json = await res.json();
                if (json.success) {
                    setTransactions(json.data || []);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchTx();
    }, []);

    const formatRupees = (paise: number) => '₹' + ((paise || 0) / 100).toLocaleString('en-IN');

    return (
        <div className="p-6 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Repayments & Immutable Ledger Stream</h1>
                    <p className="text-sm text-gray-600">
                        Chronological stream of all committed financial transactions and double-entry ledger records
                    </p>
                </div>

                <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                            <tr>
                                <th className="px-5 py-3.5 text-left">Transaction Ref</th>
                                <th className="px-5 py-3.5 text-left">Event Type</th>
                                <th className="px-5 py-3.5 text-left">Amount</th>
                                <th className="px-5 py-3.5 text-left">Counterparty / Account</th>
                                <th className="px-5 py-3.5 text-left">Agreement Ref</th>
                                <th className="px-5 py-3.5 text-left">Timestamp</th>
                                <th className="px-5 py-3.5 text-left">Ledger Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        Loading live transaction stream...
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        No ledger transactions recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx: any, idx: number) => (
                                    <tr key={tx.id || idx} className="hover:bg-gray-50">
                                        <td className="px-5 py-4 font-mono font-semibold text-gray-900">
                                            TX-{String(tx.id || '').slice(0, 8).toUpperCase()}
                                        </td>
                                        <td className="px-5 py-4 font-mono text-xs font-bold text-emerald-700">
                                            {tx.type}
                                        </td>
                                        <td className="px-5 py-4 font-mono font-bold text-gray-900">
                                            {formatRupees(tx.amountPaise)}
                                        </td>
                                        <td className="px-5 py-4 text-gray-700">{tx.borrowerName || tx.actorId}</td>
                                        <td className="px-5 py-4 font-mono text-xs text-gray-600">
                                            {tx.loanId ? `HC-${String(tx.loanId).slice(-8).toUpperCase()}` : '—'}
                                        </td>
                                        <td className="px-5 py-4 text-xs text-gray-500 font-mono">
                                            {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : '—'}
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge status="🟢 Healthy" text="COMMITTED" />
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
