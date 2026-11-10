"use client";
import React, { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function DatabaseQueryAndPurgePage() {
    const [collections, setCollections] = useState<any[]>([]);
    const [totalDocs, setTotalDocs] = useState(0);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const [target, setTarget] = useState('users');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [search, setSearch] = useState('');
    const [previewResult, setPreviewResult] = useState<any>(null);

    const fetchCollections = async () => {
        try {
            const res = await fetch('/api/admin/data/collections');
            if (res.status === 401) {
                window.location.href = '/login';
                return;
            }
            const json = await res.json();
            if (json.success) {
                setCollections(json.collections || []);
                setTotalDocs(json.totalUserDocuments || 0);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollections();
    }, []);

    const handlePreview = async () => {
        setBusy(true);
        setMessage(null);
        try {
            const res = await fetch('/api/admin/data/query-preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target, phone, email, userId, search, limit: 25 }),
            });
            const json = await res.json();
            if (json.success) {
                setPreviewResult(json);
            }
        } finally {
            setBusy(false);
        }
    };

    const handleDeleteMatching = async () => {
        const hasFilter = Boolean(phone.trim() || email.trim() || userId.trim() || search.trim());
        const confirmText = hasFilter
            ? `Delete matching documents in "${target}" (with automatic cascade if target is "users")?\n\nSchemas and indexes will remain 100% preserved and no server reload is required.`
            : `No query filter entered. Delete ALL documents inside "${target}" while preserving its Mongoose schema and MongoDB indexes?`;
        if (!window.confirm(confirmText)) return;

        setBusy(true);
        setMessage(null);
        try {
            const res = await fetch('/api/admin/data/purge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode: 'QUERY_DELETE',
                    target,
                    phone,
                    email,
                    userId,
                    search,
                    allowEmptyFilter: !hasFilter,
                    reason: `Operator executed query deletion on ${target}`,
                }),
            });
            const json = await res.json();
            if (json.success) {
                setMessage(json.message);
                await fetchCollections();
                await handlePreview();
            } else {
                setMessage(`Error: ${json.message}`);
            }
        } finally {
            setBusy(false);
        }
    };

    const handleClearSingleCollection = async (colKey: string, colLabel: string) => {
        if (
            !window.confirm(
                `Clear all documents in "${colLabel}" (${colKey})?\n\nAll Mongoose schemas and MongoDB indexes will remain 100% intact and cache will flush immediately without restarting the server.`
            )
        ) {
            return;
        }
        setBusy(true);
        setMessage(null);
        try {
            const res = await fetch('/api/admin/data/purge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode: 'QUERY_DELETE',
                    target: colKey,
                    allowEmptyFilter: true,
                    reason: `Operator cleared collection ${colKey}`,
                }),
            });
            const json = await res.json();
            if (json.success) {
                setMessage(json.message);
                await fetchCollections();
            }
        } finally {
            setBusy(false);
        }
    };

    const handlePurgeAllUserData = async () => {
        const reason = window.prompt(
            'WARNING: This will delete all mobile User records, Loans, Transactions, Ledger Entries, Chit Funds, and Notifications across MongoDB while strictly preserving all Mongoose schemas, MongoDB indexes, and Admin Operator accounts.\n\nEnter operator audit reason to confirm:',
            'Pre-deployment clean user data reset'
        );
        if (!reason) return;

        setBusy(true);
        setMessage(null);
        try {
            const res = await fetch('/api/admin/data/purge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode: 'PURGE_ALL_USER_DATA',
                    includeSecurityTelemetry: true,
                    reason,
                }),
            });
            const json = await res.json();
            if (json.success) {
                setMessage(json.message);
                setPreviewResult(null);
                await fetchCollections();
            }
        } finally {
            setBusy(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading MongoDB collections &amp; index telemetry...</div>;
    }

    return (
        <div className="p-6 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-emerald-600 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Database User-Data Query &amp; Purge Studio
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Query and delete user data in real time without restarting the server • Schemas, Indexes &amp; Admin Accounts Strictly Preserved
                        </p>
                    </div>
                    <button
                        disabled={busy}
                        onClick={handlePurgeAllUserData}
                        className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm disabled:opacity-50"
                    >
                        ⚠️ Purge All User Data ({totalDocs} Docs • Keep Schema &amp; Admins)
                    </button>
                </div>

                {message && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl text-sm font-semibold flex justify-between items-center">
                        <span>✅ {message}</span>
                        <button onClick={() => setMessage(null)} className="text-xs underline">
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Query Builder & Selective Deletion Card */}
                <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">1. Selective Query Preview &amp; Instant Data Deletion</h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Filter by collection, phone, email, user ID, or status/keyword. Preview matching documents first, then delete without server reload.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        <select
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
                        >
                            <option value="users">users (Cascades on delete)</option>
                            <option value="loans">loans (Credit Agreements)</option>
                            <option value="transactions">transactions (Transactions)</option>
                            <option value="ledgerentries">ledgerentries (Double-Entry Ledger)</option>
                            <option value="transactionintents">transactionintents (Idempotency)</option>
                            <option value="chitfunds">chitfunds (Chit Groups)</option>
                            <option value="creditscores">creditscores (Trust Scores)</option>
                            <option value="notifications">notifications (Notifications)</option>
                            <option value="notificationoutboxes">notificationoutboxes (Outbox Queue)</option>
                            <option value="mpincredentials">mpincredentials (MPIN Records)</option>
                            <option value="securityevents">securityevents (Security Events)</option>
                            <option value="reconciliationincidents">reconciliationincidents (Incidents)</option>
                            <option value="otps">otps (OTP Challenges)</option>
                        </select>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Phone (e.g. 9876543210)"
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
                        />
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
                        />
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="User ID / Actor ID"
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Keyword / Status"
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
                        />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            disabled={busy}
                            onClick={handlePreview}
                            className="px-4 py-2 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 disabled:opacity-50"
                        >
                            🔍 Preview Matching Documents
                        </button>
                        <button
                            disabled={busy}
                            onClick={handleDeleteMatching}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-50"
                        >
                            🗑️ Delete Matching Records (Preserve Schema)
                        </button>
                    </div>

                    {previewResult && (
                        <div className="mt-4 bg-gray-900 text-gray-100 rounded-xl p-4 font-mono text-xs overflow-x-auto">
                            <div className="flex justify-between items-center mb-2 text-emerald-400">
                                <span>
                                    Target: {previewResult.label} • Matching Documents: {previewResult.matchingCount}
                                </span>
                                <span>Filter: {JSON.stringify(previewResult.appliedFilter)}</span>
                            </div>
                            <pre className="max-h-64 overflow-y-auto text-[11px] leading-relaxed">
                                {JSON.stringify(previewResult.sampleDocs || [], null, 2)}
                            </pre>
                        </div>
                    )}
                </div>

                {/* Live Collections Table */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                        <h2 className="text-base font-bold text-gray-900">
                            2. Live MongoDB Collections, Document Counts &amp; Preserved Schema Indexes
                        </h2>
                        <span className="text-xs text-gray-500 font-mono">Zero-Reload Cache Invalidation Enabled</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-white text-xs font-semibold text-gray-500 uppercase">
                                <tr>
                                    <th className="px-5 py-3 text-left">Collection</th>
                                    <th className="px-5 py-3 text-left">Category</th>
                                    <th className="px-5 py-3 text-left">Live Documents</th>
                                    <th className="px-5 py-3 text-left">MongoDB Indexes</th>
                                    <th className="px-5 py-3 text-left">Schema Protection</th>
                                    <th className="px-5 py-3 text-right">Quick Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {collections.map((c: any) => (
                                    <tr key={c.key} className="hover:bg-gray-50">
                                        <td className="px-5 py-3.5">
                                            <div className="font-bold text-gray-900">{c.label}</div>
                                            <div className="text-xs text-gray-400 font-mono">{c.collectionName}</div>
                                        </td>
                                        <td className="px-5 py-3.5 font-mono text-xs text-gray-600">{c.category}</td>
                                        <td className="px-5 py-3.5 font-mono font-bold text-base text-gray-900">
                                            {Number(c.documentCount || 0).toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <StatusBadge status="🟢 Healthy" text={`${c.indexCount} Indexes Intact`} />
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {c.protected ? (
                                                <StatusBadge status="🟡 Attention" text="🔒 Protected Control Plane" />
                                            ) : (
                                                <StatusBadge status="🟢 Healthy" text="✅ Schema & Indexes Preserved" />
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            {c.protected ? (
                                                <span className="text-xs text-gray-400 font-mono">Protected</span>
                                            ) : (
                                                <button
                                                    disabled={busy}
                                                    onClick={() => handleClearSingleCollection(c.key, c.label)}
                                                    className="px-3 py-1.5 rounded border border-red-200 bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 disabled:opacity-50"
                                                >
                                                    Clear Data ({c.documentCount})
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
