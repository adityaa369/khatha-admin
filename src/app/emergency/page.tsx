'use client';
import React, { useState, useEffect } from 'react';

export default function EmergencyCommandCenter() {
  const [killSwitch, setKillSwitch] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [error, setError] = useState('');

  const fetchState = async () => {
    try {
      const [resKs, resHist] = await Promise.all([
        fetch('/api/admin/kill-switch'),
        fetch('/api/admin/kill-switch/history')
      ]);
      const dataKs = await resKs.json();
      const dataHist = await resHist.json();
      if (dataKs.success) setKillSwitch(dataKs.killSwitch);
      if (dataHist.success) setHistory(dataHist.history);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = async (activate: boolean) => {
    setError('');
    if (!reason) return setError('Reason is mandatory.');
    if (!mfaToken) return setError('MFA Token is mandatory.');

    setLoading(true);
    const endpoint = activate ? '/api/admin/kill-switch/activate' : '/api/admin/kill-switch/deactivate';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, mfaToken })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Operation failed');
      } else {
        setReason('');
        setMfaToken('');
        await fetchState();
      }
    } catch (e) {
      setError('Network error');
    }
    setLoading(false);
  };

  if (loading && !killSwitch) return <div className="p-8">Loading Emergency Controls...</div>;

  const isFrozen = killSwitch?.enabled || false;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="bg-red-900 rounded-lg shadow p-6 text-white">
          <h1 className="text-3xl font-bold tracking-tight">FINANCIAL EMERGENCY CONTROL</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Current State */}
        {!isFrozen ? (
          <div className="bg-white rounded-lg shadow p-8 border border-gray-200">
            <h2 className="text-xl font-bold text-green-600 mb-4 flex items-center">
              <span className="mr-2">🟢</span> OPERATIONS NORMAL
            </h2>
            <div className="bg-red-50 p-6 rounded-lg border border-red-100">
              <h3 className="font-bold text-red-800 mb-2">⚠ EMERGENCY FINANCIAL CONTROL</h3>
              <p className="text-sm text-red-700 mb-6">Activating the Financial Kill Switch will halt all new financial operations. This requires strict MFA and audit justification.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Reason for activation *</label>
                  <input type="text" value={reason} onChange={e => setReason(e.target.value)} className="w-full border rounded p-2 text-sm text-gray-900" placeholder="e.g. Suspected reconciliation drift" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">MFA Verification (TOTP) *</label>
                  <input type="text" value={mfaToken} onChange={e => setMfaToken(e.target.value)} className="w-full border rounded p-2 text-sm text-gray-900" placeholder="6-digit code" maxLength={6} />
                </div>
                <div className="pt-4">
                  <button onClick={() => handleToggle(true)} disabled={loading} className="w-full bg-red-600 text-white font-bold py-3 rounded hover:bg-red-700 disabled:opacity-50 transition-colors">
                    ACTIVATE KILL SWITCH
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-100 rounded-lg shadow p-8 border border-red-300">
            <h2 className="text-2xl font-bold text-red-700 mb-4 flex items-center">
              <span className="mr-2">🔴</span> FINANCIAL OPERATIONS HALTED
            </h2>
            <div className="bg-white p-6 rounded border border-red-200 text-sm mb-6 space-y-2 text-red-900">
              <p><strong>Kill Switch:</strong> ACTIVE</p>
              <p><strong>Activated by:</strong> {killSwitch.activatedBy}</p>
              <p><strong>Activated at:</strong> {new Date(killSwitch.activatedAt).toLocaleString()}</p>
              <p><strong>Reason:</strong> {killSwitch.reason}</p>
              <p className="mt-4 pt-4 border-t font-medium">All new financial operations are being blocked.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 mt-6">
              <h3 className="font-bold text-gray-800 mb-4">Restore Operations</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Reason for restoration *</label>
                  <input type="text" value={reason} onChange={e => setReason(e.target.value)} className="w-full border rounded p-2 text-sm text-gray-900" placeholder="e.g. Issue resolved, reconciliation verified" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">MFA Verification (TOTP) *</label>
                  <input type="text" value={mfaToken} onChange={e => setMfaToken(e.target.value)} className="w-full border rounded p-2 text-sm text-gray-900" placeholder="6-digit code" maxLength={6} />
                </div>
                <div className="pt-4">
                  <button onClick={() => handleToggle(false)} disabled={loading} className="w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 disabled:opacity-50 transition-colors">
                    DEACTIVATE FINANCIAL KILL SWITCH
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Operational History */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div className="bg-gray-100 px-6 py-4 border-b font-bold text-gray-800">
            Operational History
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {history.length === 0 ? (
              <div className="p-6 text-sm text-gray-500 text-center">No kill switch history found.</div>
            ) : (
              history.map((ev, i) => (
                <div key={i} className="p-6 text-sm">
                  <div className="font-mono text-xs text-gray-500 mb-2">{new Date(ev.createdAt).toLocaleString()}</div>
                  <div className="flex items-center mb-2">
                    <span className="font-bold text-gray-900 mr-2">
                      {ev.eventType === 'KILL_SWITCH_ACTIVATED' ? '🔴 KILL SWITCH ACTIVATED' : '🟢 KILL SWITCH DEACTIVATED'}
                    </span>
                  </div>
                  <div className="text-gray-700">
                    <span className="font-semibold text-gray-900">Operator:</span> {ev.actorId}
                  </div>
                  <div className="text-gray-700 mt-1">
                    <span className="font-semibold text-gray-900">Reason:</span> {ev.metadata?.reason || 'N/A'}
                  </div>
                  <div className="text-gray-700 mt-1">
                    <span className="font-semibold text-gray-900">Request ID:</span> {ev.requestId}
                  </div>
                  <div className="text-gray-700 mt-1">
                    <span className="font-semibold text-gray-900">MFA:</span> <span className="text-green-700 font-medium">VERIFIED</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

