"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function IncidentDetail() {
    const params = useParams();
    const id = params?.id as string;

    const [incident, setIncident] = useState<any>(null);
    const [auditTrail, setAuditTrail] = useState<any[]>([]);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');

    const fetchIncident = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/reconciliation/incidents/${encodeURIComponent(id)}`);
            if (res.status === 401) {
                window.location.href = '/login';
                return;
            }
            const json = await res.json();
            if (json.success && json.data) {
                setIncident(json.data.incident);
                setAuditTrail(json.data.auditTrail || []);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchIncident();
    }, [id]);

    const updateWorkflow = async (status: string) => {
        if (!notes.trim()) {
            setMessage('Please enter mandatory investigation/resolution notes first.');
            return;
        }
        setBusy(true);
        setMessage('');
        try {
            const res = await fetch(`/api/admin/reconciliation/incidents/${encodeURIComponent(id)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, notes: notes.trim(), reason: notes.trim() }),
            });
            const json = await res.json();
            if (res.ok && json.success) {
                setNotes('');
                setMessage(`Incident transitioned to ${status}`);
                await fetchIncident();
            } else {
                setMessage(json.message || 'Workflow transition failed');
            }
        } finally {
            setBusy(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-gray-500">Loading incident forensic evidence...</div>;
    }

    if (!incident) {
        return (
            <div className="p-8 space-y-4">
                <p className="text-gray-600">Incident not found.</p>
                <Link href="/reconciliation" className="text-emerald-600 hover:underline text-sm">
                    &larr; Back to Reconciliation Center
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <Link href="/reconciliation" className="text-xs font-semibold text-emerald-700 hover:underline inline-block">
                    &larr; Back to Reconciliation Center
                </Link>

                <div className="bg-white rounded-xl border shadow-sm p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-xs text-gray-500 font-mono mb-1">INCIDENT #{String(incident._id).slice(-8).toUpperCase()}</p>
                            <h1 className="text-2xl font-bold text-red-700 flex items-center">
                                {incident.severity || 'CRITICAL'} <span className="ml-2 text-gray-900 text-lg">{incident.ruleId}</span>
                            </h1>
                            <p className="mt-2 text-gray-700 font-medium">{incident.details || 'Financial reconciliation discrepancy'}</p>
                        </div>
                        <StatusBadge
                            status={incident.status === 'RESOLVED' ? '🟢 Healthy' : '🔴 Critical'}
                            text={incident.status}
                        />
                    </div>
                </div>

                {/* Evidence Vault */}
                <div className="bg-white rounded-xl border shadow-sm p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-4">EVIDENCE VAULT</h2>
                    <div className="bg-gray-50 border rounded-lg p-4 space-y-3 font-mono text-sm">
                        <div className="flex justify-between">
                            <span>Expected Value</span>
                            <span>₹{((incident.expectedValue || 0) / 100).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                            <span>Actual Value</span>
                            <span>₹{((incident.actualValue || 0) / 100).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="border-t my-2 pt-2"></div>
                        <div className="flex justify-between">
                            <span>Entity Type</span>
                            <span>{incident.entityType}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Entity ID</span>
                            <span>{incident.entityId}</span>
                        </div>
                    </div>
                </div>

                {/* Investigation Workflow */}
                <div className="bg-white rounded-xl border shadow-sm p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-4">Investigation Workflow</h2>
                    {message && (
                        <div className="mb-4 p-3 rounded bg-gray-100 text-sm font-medium text-gray-800">{message}</div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Investigation / Resolution Notes (Mandatory)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full border rounded-lg p-3 text-sm bg-white text-gray-900"
                                rows={3}
                                placeholder="Document investigation findings here..."
                            />
                        </div>

                        <div className="flex flex-wrap gap-3 border-t pt-4">
                            <button
                                disabled={busy}
                                onClick={() => updateWorkflow('ACKNOWLEDGED')}
                                className="px-4 py-2 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg text-sm font-semibold hover:bg-yellow-100"
                            >
                                Acknowledge Incident
                            </button>
                            <button
                                disabled={busy}
                                onClick={() => updateWorkflow('INVESTIGATING')}
                                className="px-4 py-2 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-sm font-semibold hover:bg-blue-100"
                            >
                                Mark Investigating
                            </button>
                            <button
                                disabled={busy}
                                onClick={() => updateWorkflow('RESOLVED')}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700"
                            >
                                Resolve Incident
                            </button>
                        </div>
                    </div>
                </div>

                {/* Audit Trail */}
                {auditTrail.length > 0 && (
                    <div className="bg-white rounded-xl border shadow-sm p-6">
                        <h2 className="text-base font-bold text-gray-900 mb-4">Chain of Custody Audit Trail</h2>
                        <div className="space-y-3 text-sm">
                            {auditTrail.map((log: any) => (
                                <div key={log._id} className="p-3 bg-gray-50 rounded border font-mono text-xs">
                                    <div>{new Date(log.createdAt).toLocaleString()} — <strong>{log.action}</strong></div>
                                    <div className="text-gray-600 mt-1">Reason: {log.reason}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
