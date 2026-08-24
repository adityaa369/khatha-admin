'use client';
import React, { useState, useEffect } from 'react';

export default function FinancialCommandCenter() {
  const [payments, setPayments] = useState<any>(null);
  const [loans, setLoans] = useState<any>(null);
  const [ledger, setLedger] = useState<any>(null);
  const [idempotency, setIdempotency] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchState = async () => {
    try {
      const [resP, resL, resLed, resI] = await Promise.all([
        fetch('/api/admin/financial/payments'),
        fetch('/api/admin/financial/loans'),
        fetch('/api/admin/financial/ledger'),
        fetch('/api/admin/financial/idempotency')
      ]);
      const [dataP, dataL, dataLed, dataI] = await Promise.all([
        resP.json(), resL.json(), resLed.json(), resI.json()
      ]);
      if (dataP.success) setPayments(dataP);
      if (dataL.success) setLoans(dataL);
      if (dataLed.success) setLedger(dataLed);
      if (dataI.success) setIdempotency(dataI);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !payments) return <div className="p-8">Loading Financial Explorer...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-end border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financial Explorer</h1>
            <p className="text-sm text-gray-600 mt-1">Read-Only Observation of Production Financial Truth</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* PAYMENTS PANEL */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 border-b px-6 py-3 flex justify-between items-center">
              <h2 className="font-bold text-lg">Payments (Last 24h)</h2>
              <div className="text-right text-xs text-gray-500 font-mono">
                Source: {payments?.meta?.source} <br/>
                Last Verified: {payments?.meta ? new Date(payments.meta.lastVerifiedAt).toLocaleTimeString() : 'N/A'}
              </div>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">Historical Truth (MongoDB)</h3>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between"><span className="text-gray-600">Committed:</span> <span className="font-bold text-green-700">{payments?.data?.historical?.paymentsCommitted}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Rejected (Overpay):</span> <span className="font-bold text-red-600">{payments?.data?.historical?.paymentsRejected}</span></div>
                  <div className="flex justify-between mt-2 pt-2 border-t"><span className="text-gray-600">Payment Volume:</span> <span className="font-bold">₹{((payments?.data?.historical?.repaymentVolumePaise || 0) / 100).toLocaleString('en-IN')}</span></div>
                </div>
              </div>
              <div className="border-l pl-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase">Live Process (Node.js)</h3>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between"><span className="text-gray-600">Attempted:</span> <span className="font-bold">{payments?.data?.process?.paymentsAttempted}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Committed:</span> <span className="font-bold">{payments?.data?.process?.paymentsCommitted}</span></div>
                  <div className="flex justify-between mt-2 pt-2 border-t"><span className="text-gray-600">P95 Latency:</span> <span className="font-bold font-mono">{payments?.data?.process?.latency?.p95?.toFixed(2)}ms</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* LOANS PANEL */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 border-b px-6 py-3 flex justify-between items-center">
              <h2 className="font-bold text-lg">Loans (All Time)</h2>
              <div className="text-right text-xs text-gray-500 font-mono">
                Source: {loans?.meta?.source} <br/>
                Last Verified: {loans?.meta ? new Date(loans.meta.lastVerifiedAt).toLocaleTimeString() : 'N/A'}
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6 flex justify-between items-center bg-blue-50 p-4 rounded border border-blue-100">
                <span className="font-semibold text-blue-900">Active Loan Total Payable:</span>
                <span className="text-2xl font-bold text-blue-800">₹{((loans?.data?.activeLoanTotalPayablePaise || 0) / 100).toLocaleString('en-IN')}</span>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-gray-50 p-3 rounded border">
                  <div className="text-xs text-gray-500 font-bold uppercase">Active</div>
                  <div className="text-xl font-bold mt-1 text-green-700">{loans?.data?.distribution?.active || 0}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded border">
                  <div className="text-xs text-gray-500 font-bold uppercase">Pending</div>
                  <div className="text-xl font-bold mt-1 text-yellow-600">{loans?.data?.distribution?.pending_approval || 0}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded border">
                  <div className="text-xs text-gray-500 font-bold uppercase">Completed</div>
                  <div className="text-xl font-bold mt-1 text-blue-600">{loans?.data?.distribution?.completed || 0}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded border">
                  <div className="text-xs text-gray-500 font-bold uppercase">Rejected</div>
                  <div className="text-xl font-bold mt-1 text-red-600">{loans?.data?.distribution?.rejected || 0}</div>
                </div>
              </div>
            </div>
          </div>

          {/* LEDGER RECONCILIATION PANEL */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 border-b px-6 py-3 flex justify-between items-center">
              <h2 className="font-bold text-lg">Ledger Reconciliation</h2>
              <div className="text-right text-xs text-gray-500 font-mono">
                Source: {ledger?.meta?.source} <br/>
                Last Verified: {ledger?.meta ? new Date(ledger.meta.lastVerifiedAt).toLocaleTimeString() : 'N/A'}
              </div>
            </div>
            <div className="p-6">
              <div className={`p-4 rounded border mb-6 flex justify-between items-center ${ledger?.data?.ledgerStatus === 'BALANCED' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                <span className="font-bold text-lg">Ledger Status</span>
                <span className="font-black text-2xl tracking-widest">{ledger?.data?.ledgerStatus === 'BALANCED' ? 'BALANCED ✅' : 'UNBALANCED 🔴'}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded border">
                <span className="font-semibold text-gray-700">Ledger Gap (Discrepancy):</span>
                <span className="font-mono font-bold text-gray-900">₹{((ledger?.data?.ledgerGap || 0) / 100).toLocaleString('en-IN')}</span>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <span className="font-bold">{ledger?.data?.openIncidentCount || 0}</span> Open Investigation Incidents
              </div>
            </div>
          </div>

          {/* IDEMPOTENCY PANEL */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 border-b px-6 py-3 flex justify-between items-center">
              <h2 className="font-bold text-lg">Idempotency & Replays (Last 24h)</h2>
              <div className="text-right text-xs text-gray-500 font-mono">
                Source: {idempotency?.meta?.source} <br/>
                Last Verified: {idempotency?.meta ? new Date(idempotency.meta.lastVerifiedAt).toLocaleTimeString() : 'N/A'}
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6">Tracking duplicate requests safely intercepted and returned from cache.</p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded border">
                  <div className="text-sm text-gray-500 font-bold uppercase mb-2">Historical Replays</div>
                  <div className="text-3xl font-black text-gray-800">{idempotency?.data?.historicalReplays || 0}</div>
                  <div className="text-xs text-gray-400 mt-2">MongoDB SecurityEvents</div>
                </div>
                <div className="bg-gray-50 p-4 rounded border">
                  <div className="text-sm text-gray-500 font-bold uppercase mb-2">Process Replays</div>
                  <div className="text-3xl font-black text-gray-800">{idempotency?.data?.processReplays || 0}</div>
                  <div className="text-xs text-gray-400 mt-2">In-memory PM2 telemetry</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

