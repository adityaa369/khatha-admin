"use client";
import React, { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function AdministrationCenter() {
    const [admins, setAdmins] = useState<any[]>([]);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSystem = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/admin/system');
                if (res.status === 401) {
                    window.location.href = '/login';
                    return;
                }
                const json = await res.json();
                if (json.success) {
                    setAdmins(json.admins || []);
                    setAuditLogs(json.auditLogs || []);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchSystem();
    }, []);

    return (
        <div className="p-6 sm:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Administrators & Immutable Audit Trail</h1>
                    <p className="text-sm text-gray-600">Zero-trust role-based access control and operator action log</p>
                </div>

                {/* Admin Management */}
                <div className="bg-white rounded-xl border shadow-sm p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-4">AUTHORIZED OPERATORS</h2>
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-gray-500 uppercase">
                                <th className="py-2">Operator Email</th>
                                <th className="py-2">Role</th>
                                <th className="py-2">Status</th>
                                <th className="py-2">MFA</th>
                                <th className="py-2">Last Login</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-4 text-gray-500">Loading operators...</td>
                                </tr>
                            ) : admins.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-4 text-gray-500">Default Operator active.</td>
                                </tr>
                            ) : (
                                admins.map((a: any) => (
                                    <tr key={a._id}>
                                        <td className="py-3 font-mono font-bold text-gray-900">{a.email}</td>
                                        <td className="py-3 font-semibold text-gray-700">{a.role}</td>
                                        <td className="py-3">
                                            <StatusBadge status={a.isActive ? '🟢 Healthy' : '🔴 Critical'} text={a.isActive ? 'ACTIVE' : 'DISABLED'} />
                                        </td>
                                        <td className="py-3">
                                            <StatusBadge status="🟢 Healthy" text={a.mfaEnabled ? 'TOTP MFA' : 'SESSION VERIFIED'} />
                                        </td>
                                        <td className="py-3 text-gray-500 font-mono text-xs">
                                            {a.lastLoginAt ? new Date(a.lastLoginAt).toLocaleString() : 'Active Session'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Role Permissions Map */}
                <div className="bg-white rounded-xl border shadow-sm p-6 border-l-4 border-l-emerald-600">
                    <h2 className="text-base font-bold text-gray-900 mb-3">Zero-Trust Administrative Boundaries</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm bg-gray-50 p-4 rounded-lg border">
                        <div>
                            <strong className="text-emerald-700 block mb-2">Permitted Operator Actions:</strong>
                            <ul className="space-y-1 text-gray-700">
                                <li>✓ Inspect live infrastructure, credits, and user profiles</li>
                                <li>✓ Suspend/unsuspend abusive accounts & verify user emails</li>
                                <li>✓ Investigate & resolve reconciliation incidents</li>
                                <li>✓ Activate/deactivate the Emergency Financial Kill Switch</li>
                            </ul>
                        </div>
                        <div>
                            <strong className="text-red-700 block mb-2">Strictly Forbidden (Enforced in Code):</strong>
                            <ul className="space-y-1 text-gray-700">
                                <li>✕ Cannot directly edit or falsify credit balances or ledger entries</li>
                                <li>✕ Cannot delete immutable Transactions or AdminAuditLogs</li>
                                <li>✕ Cannot bypass counterparty OTP/session consent on agreements</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Live Audit Log */}
                <div className="bg-white rounded-xl border shadow-sm p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-4">Immutable Operator Audit Trail ({auditLogs.length})</h2>
                    {auditLogs.length === 0 ? (
                        <p className="text-sm text-gray-500">No administrative mutations recorded yet.</p>
                    ) : (
                        <div className="space-y-4 border-l-2 border-gray-200 ml-2 pl-4">
                            {auditLogs.map((log: any) => (
                                <div key={log._id} className="pb-3 border-b border-gray-100 last:border-b-0">
                                    <p className="text-xs font-mono text-gray-500">
                                        {new Date(log.createdAt).toLocaleString()} | REQ: {log.requestId || 'INTERNAL'}
                                    </p>
                                    <p className="font-bold text-gray-900 mt-0.5">{log.action}</p>
                                    <p className="text-xs text-gray-600 mt-0.5">
                                        Operator: <span className="font-mono">{log.adminId?.email || log.adminId}</span>
                                        {log.resourceId ? ` • Target: ${log.resourceType || ''} ${log.resourceId}` : ''}
                                    </p>
                                    {log.reason && (
                                        <p className="text-xs bg-gray-100 p-2 rounded mt-1.5 font-mono text-gray-800">
                                            Reason: &ldquo;{log.reason}&rdquo;
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
