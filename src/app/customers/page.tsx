"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function CustomerCommandCenter() {
    const [overview, setOverview] = useState<any>(null);
    const [customers, setCustomers] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState<string | null>(null);
    const [bannerMsg, setBannerMsg] = useState<string | null>(null);

    const fetchCustomers = async (q = search) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/customers${q ? `?search=${encodeURIComponent(q)}` : ''}`);
            if (res.status === 401) {
                window.location.href = '/login';
                return;
            }
            const json = await res.json();
            if (json.success) {
                setOverview(json.overview || {});
                setCustomers(json.customers || []);
            }
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers('');
    }, []);

    const handleToggleSuspend = async (user: any) => {
        const targetId = user.id || user._id;
        const nextSuspend = !user.isSuspended;
        setActionId(targetId);
        try {
            const res = await fetch(`/api/admin/customers/${encodeURIComponent(targetId)}/suspend`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    suspend: nextSuspend,
                    reason: nextSuspend ? 'Suspended via HandCredit Admin Portal' : 'Re-activated via HandCredit Admin Portal',
                }),
            });
            if (res.ok) {
                await fetchCustomers(search);
            }
        } finally {
            setActionId(null);
        }
    };

    const handleVerifyEmail = async (user: any) => {
        const targetId = user.id || user._id;
        setActionId(targetId);
        try {
            const res = await fetch(`/api/admin/customers/${encodeURIComponent(targetId)}/verify-email`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                await fetchCustomers(search);
            }
        } finally {
            setActionId(null);
        }
    };

    const handleDeleteUserData = async (user: any) => {
        const targetId = user.id || user._id;
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.phone || targetId;
        if (
            !window.confirm(
                `Delete user "${fullName}" (+91 ${user.phone || ''}) and cascade-delete all their loans, transactions, ledger entries, and notifications?\n\nSchemas and indexes will remain 100% intact and no server reload is required.`
            )
        ) {
            return;
        }
        setActionId(targetId);
        setBannerMsg(null);
        try {
            const res = await fetch(`/api/admin/customers/${encodeURIComponent(targetId)}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: 'Operator deleted user data from Users directory' }),
            });
            const json = await res.json();
            if (res.ok && json.success) {
                setBannerMsg(json.message || `Deleted user ${fullName} and associated records.`);
                await fetchCustomers(search);
            }
        } finally {
            setActionId(null);
        }
    };

    return (
        <div className="p-6 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Users &amp; Account Management</h1>
                        <p className="text-sm text-gray-600">
                            Real-time directory of all registered HandCredit users •{' '}
                            <Link href="/database" className="text-emerald-700 font-semibold hover:underline">
                                Open Database Query &amp; Bulk Purge Studio &rarr;
                            </Link>
                        </p>
                    </div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            fetchCustomers(search);
                        }}
                        className="flex gap-2 w-full sm:w-auto"
                    >
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search mobile, name, email, city..."
                            className="border border-gray-300 rounded-lg px-3.5 py-2 text-sm bg-white text-gray-900 w-full sm:w-72"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {bannerMsg && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-semibold flex justify-between items-center">
                        <span>✅ {bannerMsg}</span>
                        <button onClick={() => setBannerMsg(null)} className="text-xs underline">
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Live Overview Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <MetricCard
                        title="Total Registered Users"
                        value={overview ? Number(overview.totalCustomers || 0).toLocaleString('en-IN') : '...'}
                        status="🟢 Healthy"
                    />
                    <MetricCard
                        title="Active Accounts"
                        value={overview ? Number(overview.active || 0).toLocaleString('en-IN') : '...'}
                        status="🟢 Healthy"
                    />
                    <MetricCard
                        title="UIDAI Aadhaar Verified"
                        value={overview ? Number(overview.aadhaarVerifiedCount || 0).toLocaleString('en-IN') : '...'}
                        status="🟢 Healthy"
                        explanation="Users who have completed Paperless UIDAI Aadhaar eKYC via DigiLocker / MeriPehchaan."
                    />
                    <MetricCard
                        title="Unverified Emails"
                        value={overview ? Number(overview.pendingKyc || 0).toLocaleString('en-IN') : '...'}
                        status={(overview?.pendingKyc || 0) > 0 ? '🟡 Attention' : '🟢 Healthy'}
                        explanation="Users who registered via Mobile OTP and have not yet clicked their email verification link."
                    />
                    <MetricCard
                        title="Suspended Accounts"
                        value={overview ? Number(overview.suspendedCount || 0).toLocaleString('en-IN') : '...'}
                        status={(overview?.suspendedCount || 0) > 0 ? '🔴 Critical' : '🟢 Healthy'}
                        explanation="Accounts blocked from accessing the platform."
                    />
                </div>

                {/* Live User Table */}
                <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                            <tr>
                                <th className="px-5 py-3.5 text-left">User</th>
                                <th className="px-5 py-3.5 text-left">Mobile</th>
                                <th className="px-5 py-3.5 text-left">Email &amp; Verification</th>
                                <th className="px-5 py-3.5 text-left">DOB / City</th>
                                <th className="px-5 py-3.5 text-left">Status</th>
                                <th className="px-5 py-3.5 text-right">Operator Controls</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Loading live users from MongoDB...
                                    </td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No matching users found.
                                    </td>
                                </tr>
                            ) : (
                                customers.map((u) => {
                                    const uid = u.id || u._id;
                                    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'HandCredit User';
                                    const isBusy = actionId === uid;
                                    return (
                                        <tr key={uid} className="hover:bg-gray-50">
                                            <td className="px-5 py-4">
                                                <Link
                                                    href={`/customers/${encodeURIComponent(uid)}`}
                                                    className="font-bold text-gray-900 hover:text-emerald-600 hover:underline block"
                                                >
                                                    {fullName}
                                                </Link>
                                                <span className="text-xs text-gray-400 font-mono">
                                                    ID: {String(uid).slice(0, 8)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 font-mono text-gray-800">+91 {u.phone}</td>
                                            <td className="px-5 py-4">
                                                <div className="text-gray-800">{u.email || '—'}</div>
                                                <div className="mt-1 flex flex-wrap gap-1.5">
                                                    {u.isEmailVerified ? (
                                                        <StatusBadge status="🟢 Healthy" text="Email Verified" />
                                                    ) : (
                                                        <StatusBadge status="🟡 Attention" text="Unverified Email" />
                                                    )}
                                                    {u.isAadhaarVerified ? (
                                                        <StatusBadge
                                                            status="🟢 Healthy"
                                                            text={`Aadhaar: ${u.aadhaarMasked || 'Verified'}`}
                                                        />
                                                    ) : (
                                                        <StatusBadge status="🟡 Attention" text="Aadhaar Unverified" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-gray-600">
                                                <div>DOB: {u.dob || '—'}</div>
                                                <div className="text-xs text-gray-400">{u.city || 'India'}</div>
                                            </td>
                                            <td className="px-5 py-4">
                                                {u.isSuspended ? (
                                                    <StatusBadge status="🔴 Critical" text="SUSPENDED" />
                                                ) : (
                                                    <StatusBadge status="🟢 Healthy" text="ACTIVE" />
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-right space-x-2 whitespace-nowrap">
                                                <Link
                                                    href={`/customers/${encodeURIComponent(uid)}`}
                                                    className="px-2.5 py-1.5 rounded border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                                                >
                                                    360° View
                                                </Link>
                                                {!u.isEmailVerified && u.email && (
                                                    <button
                                                        disabled={isBusy}
                                                        onClick={() => handleVerifyEmail(u)}
                                                        className="px-2.5 py-1.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100"
                                                    >
                                                        Verify Email
                                                    </button>
                                                )}
                                                <button
                                                    disabled={isBusy}
                                                    onClick={() => handleToggleSuspend(u)}
                                                    className={
                                                        'px-2.5 py-1.5 rounded text-xs font-semibold border ' +
                                                        (u.isSuspended
                                                            ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100')
                                                    }
                                                >
                                                    {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                                                </button>
                                                <button
                                                    disabled={isBusy}
                                                    onClick={() => handleDeleteUserData(u)}
                                                    className="px-2.5 py-1.5 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
                                                >
                                                    Delete Data
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
