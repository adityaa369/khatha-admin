import React from 'react';
import { MetricCard } from '@/components/ui/MetricCard';

export default function Dashboard() {
  // In a real app, this would fetch from /api/admin/dashboard
  const isHealthy = true;
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white border rounded-lg p-6 flex justify-between items-center shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Good afternoon, Operator</h1>
            <p className={`text-sm mt-1 ${isHealthy ? 'text-green-600' : 'text-red-600'}`}>
              {isHealthy ? 'Khatha is operating normally' : 'Khatha requires attention. One financial issue is currently being investigated.'}
            </p>
          </div>
          <div className="flex space-x-2">
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">API: ?? Connected</span>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">DB: ?? Connected</span>
          </div>
        </div>

        {/* Financial Metrics */}
        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-4">FINANCIAL</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard 
            title="Payments Today" 
            value="?8,42,300" 
            explanation="The total value of all successfully committed loan and chit payments today."
            status="?? Healthy"
          />
          <MetricCard 
            title="Active Loans" 
            value="1,284" 
            explanation="Number of loans currently in repayment status."
          />
          <MetricCard 
            title="Ledger Gap" 
            value="?0" 
            status="?? Healthy"
            explanation="Difference between total system Debits and Credits."
            technical="DB.LedgerEntry.aggregate({ DEBIT - CREDIT }) === 0"
          />
          <MetricCard 
            title="Critical Incidents" 
            value="0" 
            status="?? Healthy"
            explanation="Open financial reconciliation mismatches requiring immediate investigation."
          />
        </div>

        {/* Infrastructure */}
        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-4">INFRASTRUCTURE</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard 
            title="API P95 Latency" 
            value="184 ms" 
            status="?? Healthy"
            explanation="This measures how quickly the server responds to requests. 184ms means 95% of requests completed within approx 184 milliseconds."
            technical="Calculated via process.hrtime() in middleware/metrics.js"
          />
          <MetricCard 
            title="Database Connection" 
            value="31 / 60" 
            status="?? Healthy"
            explanation="Active connections to MongoDB Atlas versus maximum allowed pool size."
            technical="Mongoose maxPoolSize: 15 per worker * 4 workers"
          />
          <MetricCard 
            title="Financial Kill Switch" 
            value="OFF" 
            status="?? Healthy"
            explanation="If enabled, all financial mutations (payments, loans) are immediately blocked."
          />
        </div>
      </div>
    </div>
  );
}
