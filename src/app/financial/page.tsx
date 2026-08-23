import React from 'react';
import { MetricCard } from '@/components/ui/MetricCard';

export default function FinancialCommandCenter() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Financial Command Center</h1>
        <p className="text-sm text-gray-600 mb-8">Is money flowing correctly through Khatha?</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard 
            title="Payments Today" 
            value="?8,42,300" 
            status="?? Healthy"
            explanation="The total volume of successfully settled payments across Loans and Chits."
          />
          <MetricCard 
            title="Ledger Difference" 
            value="?0" 
            status="?? Balanced"
            explanation="The total money recorded as leaving accounts matches the total money recorded as entering accounts."
          />
          <MetricCard 
            title="Reconciliation" 
            value="PASS" 
            status="?? Healthy"
            explanation="Mathematical verification of outstanding balances against underlying ledgers."
          />
          <MetricCard 
            title="Financial Incidents" 
            value="2" 
            status="?? Attention"
            explanation="Open operational anomalies requiring Support or Finance review."
          />
        </div>
      </div>
    </div>
  );
}
