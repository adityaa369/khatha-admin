
import React from 'react';
import { MetricCard } from '@/components/ui/MetricCard';

export default function CustomerCommandCenter() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Customer Command Center</h1>
        <p className="text-sm text-gray-600 mb-8">What is happening with our customers?</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard 
            title="Total Customers" 
            value="12,482" 
          />
          <MetricCard 
            title="Active Customers" 
            value="11,903" 
            status="🟢 Healthy"
          />
          <MetricCard 
            title="Pending KYC" 
            value="381" 
            status="🟡 Attention"
          />
          <MetricCard 
            title="Security Alerts" 
            value="19" 
            status="🔴 Critical"
            explanation="Unresolved identity or authentication anomalies."
          />
        </div>
      </div>
    </div>
  );
}
