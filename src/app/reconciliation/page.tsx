
import React from 'react';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ExplanationPopover } from '@/components/ui/ExplanationPopover';

export default function ReconciliationCommandCenter() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <h1 className="text-2xl font-bold text-gray-900">FINANCIAL INTEGRITY</h1>
          <p className="text-sm font-medium text-red-700 mt-1">?? FINANCIAL INTEGRITY ISSUE. Critical discrepancies require investigation.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard title="Loans" value="100%" status="🟢 Healthy" explanation="Loan paidAmountPaise matches ledger." />
          <MetricCard title="Chits" value="100%" status="🟢 Healthy" explanation="Dividend/Commission allocation math matches pot." />
          <MetricCard title="Ledger" value="Balanced" status="🟢 Healthy" explanation="Global Debits equals Global Credits." />
          <MetricCard title="Open Incidents" value="1" status="🔴 Critical" explanation="Financial mismatches requiring human resolution." />
        </div>

        {/* Global Financial Health (LEDGER-001) */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            Global Financial Health
            <ExplanationPopover title="LEDGER-001" meaning="The total money recorded entering accounts must equal the total money recorded leaving accounts." technical="SUM(DEBIT) == SUM(CREDIT)" />
          </h2>
          <div className="grid grid-cols-3 gap-8 text-sm bg-gray-50 p-4 rounded border">
            <div>
              <p className="text-gray-500 mb-1">Total Debits</p>
              <p className="font-mono text-xl text-gray-900">?1,84,52,000</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Total Credits</p>
              <p className="font-mono text-xl text-gray-900">?1,84,52,000</p>
            </div>
            <div className="border-l pl-8">
              <p className="text-gray-500 mb-1">Difference</p>
              <p className="font-mono text-xl text-green-700">₹0</p>
              <StatusBadge status="🟢 Healthy" text="BALANCED" />
            </div>
          </div>
        </div>

        {/* Example Finding vs Incident */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500 mt-8">
           <h3 className="font-bold text-gray-900">INC-000182: LOAN-003</h3>
           <p className="text-sm text-gray-600 mb-4 mt-1">
             <strong>Human explanation:</strong> Every rupee recorded as paid on a loan must have a corresponding financial transaction in the ledger.
           </p>
           <div className="grid grid-cols-3 gap-4">
             <div className="bg-gray-50 p-3 rounded">
               <span className="text-xs text-gray-500 uppercase">Expected (Ledger)</span>
               <div className="font-mono mt-1 text-lg">?5,000</div>
             </div>
             <div className="bg-gray-50 p-3 rounded">
               <span className="text-xs text-gray-500 uppercase">Actual (Loan)</span>
               <div className="font-mono mt-1 text-lg text-red-600">?6,000</div>
             </div>
             <div className="bg-gray-50 p-3 rounded">
               <span className="text-xs text-gray-500 uppercase">Difference</span>
               <div className="font-mono mt-1 text-lg text-red-600">?1,000</div>
             </div>
           </div>
           <div className="mt-4">
             <button className="text-blue-600 font-medium text-sm hover:underline">View Investigation ?</button>
           </div>
        </div>

      </div>
    </div>
  );
}
