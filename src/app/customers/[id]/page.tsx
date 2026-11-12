"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function CustomerDetail() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/customers/${encodeURIComponent(id)}`);
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
        if (id) fetchDetail();
    }, [id]);

    const formatRupees = (paise: number) => '₹' + ((paise || 0) / 100).toLocaleString('en-IN');

    const handleToggleSuspend = async () => {
        if (!data?.user) return;
        setBusy(true);
        try {
            const nextSuspend = !data.user.isSuspended;
            await fetch(`/api/admin/customers/${encodeURIComponent(id)}/suspend`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    suspend: nextSuspend,
                    reason: nextSuspend ? 'Suspended from Customer 360 View' : 'Unsuspended from Customer 360 View',
                }),
            });
            await fetchDetail();
        } finally {
            setBusy(false);
        }
    };

    const handleVerifyEmail = async () => {
        setBusy(true);
        try {
            await fetch(`/api/admin/customers/${encodeURIComponent(id)}/verify-email`, { method: 'PUT' });
            await fetchDetail();
        } finally {
            setBusy(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!data?.user) return;
        const fullName = `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim() || data.user.phone;
        if (
            !window.confirm(
                `Permanently delete user "${fullName}" and cascade-delete all associated loans, transactions, ledger entries, and notifications?\n\nDatabase schemas and indexes remain preserved.`
            )
        ) {
            return;
        }
        setBusy(true);
        try {
            const res = await fetch(`/api/admin/customers/${encodeURIComponent(id)}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: 'Deleted from Customer 360 View' }),
            });
            if (res.ok) {
                router.push('/customers');
            }
        } finally {
            setBusy(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-gray-500">Loading Customer 360 profile...</div>;
    }

    if (!data?.user) {
        return (
            <div className="p-8 space-y-4">
                <p className="text-red-600 font-semibold">User not found.</p>
                <Link href="/customers" className="text-emerald-600 hover:underline text-sm">
                    &larr; Back to Users &amp; Accounts
                </Link>
            </div>
        );
    }

    const user = data.user;
    const loans = data.loans || [];
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'HandCredit User';

    return (
        <div className="p-6 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <Link href="/customers" className="text-xs font-semibold text-emerald-700 hover:underline inline-block">
                    &larr; Back to Users Directory
                </Link>

                {/* Customer 360 Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-emerald-600 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <p className="text-xs text-gray-500 font-mono mb-1">ACCOUNT ID: HC-{String(user.id || user._id).slice(0, 8).toUpperCase()}</p>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {fullName} <span className="text-gray-500 font-mono text-base">(+91 {user.phone})</span>
                        </h1>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {user.isSuspended ? (
                                <StatusBadge status="🔴 Critical" text="SUSPENDED" />
                            ) : (
                                <StatusBadge status="🟢 Healthy" text="ACTIVE ACCOUNT" />
                            )}
                            {user.isEmailVerified ? (
                                <StatusBadge status="🟢 Healthy" text="EMAIL VERIFIED" />
                            ) : (
                                <StatusBadge status="🟡 Attention" text="EMAIL UNVERIFIED" />
                            )}
                            {user.isAadhaarVerified ? (
                                <StatusBadge
                                    status="🟢 Healthy"
                                    text={`UIDAI AADHAAR VERIFIED (${user.aadhaarMasked || 'XXXX-XXXX'})`}
                                />
                            ) : (
                                <StatusBadge status="⚪ Unverified" text="AADHAAR eKYC PENDING" />
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {!user.isEmailVerified && user.email && (
                            <button
                                disabled={busy}
                                onClick={handleVerifyEmail}
                                className="px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                            >
                                Verify Email Manually
                            </button>
                        )}
                        <button
                            disabled={busy}
                            onClick={handleToggleSuspend}
                            className={
                                'px-3.5 py-2 rounded-lg text-xs font-bold border ' +
                                (user.isSuspended
                                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100')
                            }
                        >
                            {user.isSuspended ? 'Unsuspend Account' : 'Suspend Account'}
                        </button>
                        <button
                            disabled={busy}
                            onClick={handleDeleteUser}
                            className="px-3.5 py-2 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                        >
                            Delete User Data (Cascade)
                        </button>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="bg-white rounded-xl border shadow-sm p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-4">Registered Identity &amp; Profile Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                        <div>
                            <p className="text-gray-500 text-xs uppercase">Email Address</p>
                            <p className="font-semibold text-gray-900 mt-1">{user.email || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase">Date of Birth &amp; Gender</p>
                            <p className="font-semibold text-gray-900 mt-1">
                                {user.dob || 'Not provided'} ({user.gender || '—'})
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase">City &amp; Address</p>
                            <p className="font-semibold text-gray-900 mt-1">
                                {user.city || '—'} {user.address ? `• ${user.address}` : ''}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase">Aadhaar eKYC Status</p>
                            <p className="font-semibold text-gray-900 mt-1">
                                {user.isAadhaarVerified
                                    ? `Verified (${user.aadhaarMasked || 'XXXX-XXXX'})`
                                    : 'Not Yet Verified'}
                            </p>
                        </div>
                        {user.aadhaarKycData?.fullName && (
                            <div>
                                <p className="text-gray-500 text-xs uppercase">UIDAI Verified Name &amp; C/O</p>
                                <p className="font-semibold text-emerald-800 mt-1">
                                    {user.aadhaarKycData.fullName}{' '}
                                    {user.aadhaarKycData.careOf ? `(${user.aadhaarKycData.careOf})` : ''}
                                </p>
                            </div>
                        )}
                        {user.aadhaarKycData?.fullAddress && (
                            <div>
                                <p className="text-gray-500 text-xs uppercase">UIDAI Registered Address</p>
                                <p className="font-semibold text-gray-900 mt-1">{user.aadhaarKycData.fullAddress}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* User's Credits & Agreements */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="p-6 border-b">
                        <h2 className="text-base font-bold text-gray-900">
                            Associated Credits &amp; Mutual Agreements ({loans.length})
                        </h2>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                            <tr>
                                <th className="px-5 py-3 text-left">Agreement Ref</th>
                                <th className="px-5 py-3 text-left">Role</th>
                                <th className="px-5 py-3 text-left">Counterparty</th>
                                <th className="px-5 py-3 text-left">Type</th>
                                <th className="px-5 py-3 text-left">Principal</th>
                                <th className="px-5 py-3 text-left">Paid</th>
                                <th className="px-5 py-3 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loans.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        No credit records found for this user.
                                    </td>
                                </tr>
                            ) : (
                                loans.map((l: any) => (
                                    <tr key={l._id}>
                                        <td className="px-5 py-3.5 font-mono font-semibold text-gray-900">
                                            HC-{String(l._id).slice(-8).toUpperCase()}
                                        </td>
                                        <td className="px-5 py-3.5 text-xs font-bold text-gray-700">{l.role}</td>
                                        <td className="px-5 py-3.5 text-gray-700">
                                            {l.borrowerName} ({l.borrowerPhone})
                                        </td>
                                        <td className="px-5 py-3.5 uppercase text-xs font-semibold text-gray-600">
                                            {String(l.loanType || 'hand_credit').replace('_', ' ')}
                                        </td>
                                        <td className="px-5 py-3.5 font-mono">{formatRupees(l.amountPaise)}</td>
                                        <td className="px-5 py-3.5 font-mono text-emerald-700">{formatRupees(l.paidAmountPaise)}</td>
                                        <td className="px-5 py-3.5">
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
