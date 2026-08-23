import React from 'react';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function ChitCommandCenter() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Chit Command Center</h1>
        <p className="text-sm text-gray-600 mb-8">Are our Chit Funds operating correctly right now?</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard 
            title="Active Chits" 
            value="186" 
            explanation="Number of chit groups currently running and active."
          />
          <MetricCard 
            title="Live Auctions" 
            value="14" 
            status="🟢 Healthy"
            explanation="Auctions currently open for bidding across all chits."
          />
          <MetricCard 
            title="Reconciliation" 
            value="ALL CLEAR" 
            status="🟢 Healthy"
            explanation="Mathematical verification of outstanding balances against underlying ledgers."
            technical="All CHIT-002, CHIT-003, and LEDGER-001 checks passed."
          />
          <MetricCard 
            title="Financial Incidents" 
            value="1" 
            status="🔴 Critical"
            explanation="Open operational anomalies requiring Support or Finance review."
          />
        </div>

        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-4">Live Auctions</h2>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold">Chit #CH-182 <span className="text-sm font-normal text-gray-500 ml-2">Cycle 7</span></h3>
              <div className="mt-2 text-3xl font-bold text-gray-900">?42,000 <span className="text-sm text-gray-500 font-normal">Current lowest bid</span></div>
            </div>
            <div className="text-right">
              <StatusBadge status="🟢 Healthy" text="LIVE" />
              <div className="mt-2 text-xl font-mono text-gray-900">03:24</div>
              <div className="text-sm text-gray-500">Members: 20 / 20</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
