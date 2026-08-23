
import React from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function IncidentDetail() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500 font-mono mb-1">INCIDENT #INC-000182</p>
              <h1 className="text-2xl font-bold text-red-700 flex items-center">
                ?? CRITICAL <span className="ml-2 text-gray-900 text-lg">LOAN-003</span>
              </h1>
              <p className="mt-2 text-gray-700 font-medium">Loan paid amount does not match ledger-supported payments.</p>
            </div>
            <StatusBadge status="🔴 Critical" text="OPEN" />
          </div>
        </div>

        {/* Evidence Vault */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">EVIDENCE VAULT</h2>
          <div className="bg-gray-50 border rounded-lg p-4 space-y-3 font-mono text-sm">
             <div className="flex justify-between"><span>Expected</span><span>?5,000</span></div>
             <div className="flex justify-between text-red-600"><span>Actual</span><span>?6,000</span></div>
             <div className="flex justify-between font-bold text-red-600"><span>Difference</span><span>?1,000</span></div>
             <div className="border-t my-2 pt-2"></div>
             <div className="flex justify-between"><span>Authoritative Loan</span><a href="#" className="text-blue-600 hover:underline">KH-10293</a></div>
             <div className="flex justify-between"><span>Authoritative Transaction</span><a href="#" className="text-blue-600 hover:underline">TX-918273</a></div>
             <div className="flex justify-between"><span>Detected By</span><span>Reconciliation Engine</span></div>
          </div>
          <div className="bg-blue-50 text-blue-800 p-4 rounded mt-4 text-sm">
            <strong>Why this matters:</strong> The loan record claims ?6,000 has been paid, but the financial ledger only contains evidence for ?5,000.
          </div>
        </div>

        {/* Investigation Workflow */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Investigation Workflow</h2>
          
          <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Resolution Notes (Mandatory)</label>
               <textarea className="w-full border rounded p-2 text-sm bg-gray-50" rows={3} placeholder="Document investigation findings here..."></textarea>
             </div>
             
             <div className="flex space-x-4 border-t pt-4">
               <button className="px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded text-sm font-medium hover:bg-yellow-100">
                 Acknowledge Incident
               </button>
               <button className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded text-sm font-medium hover:bg-blue-100">
                 Escalate to Finance
               </button>
               <button className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded text-sm font-medium hover:bg-green-100">
                 Resolve Incident
               </button>
             </div>
          </div>
        </div>

        {/* Read Only Proof */}
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded text-sm flex justify-between items-center">
          <div>
            <strong>Operational Rule Enforced:</strong> The Admin panel cannot directly manipulate authoritative financial balances. Resolutions must be processed via compensating ledger entries in independent workflows.
          </div>
          <StatusBadge status="🟢 Healthy" text="READ-ONLY MODE" />
        </div>

      </div>
    </div>
  );
}
