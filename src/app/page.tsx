
"use client";
import React, { useState, useEffect } from 'react';
import { MetricCard } from '@/components/ui/MetricCard';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastVerified, setLastVerified] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      if (res.status === 401) {
         window.location.href = '/login';
         return;
      }
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setError(false);
        setLastVerified(new Date().toLocaleTimeString());
      } else {
        throw new Error('API Error');
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 15000); // 15-second polling
    return () => clearInterval(interval);
  }, []);

  const formatRupees = (paise: number) => {
      if (paise === null || paise === undefined) return 'Unknown';
      return `?${(paise / 100).toLocaleString('en-IN')}`;
  };

  if (loading && !data) {
    return <div className="min-h-screen flex items-center justify-center">Loading operational data...</div>;
  }

  // Derive status cleanly
  const isHealthy = !error && data?.health?.api === 'healthy' && data?.health?.db === 'connected';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white border rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Good afternoon, Operator</h1>
            <p className={`text-sm mt-1 ${error ? 'text-red-600' : (isHealthy ? 'text-green-600' : 'text-yellow-600')}`}>
              {error ? '?? KHATHA REQUIRES ATTENTION: Unable to reach backend systems.' : (isHealthy ? 'Khatha is operating normally' : 'Khatha requires attention. Infrastructure may be degraded.')}
            </p>
          </div>
          <div className="flex flex-col items-end mt-4 md:mt-0 space-y-2">
            <div className="flex space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${error || !data?.health ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                API: {error || !data?.health ? '?? Unknown' : '?? Connected'}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${error || data?.health?.db !== 'connected' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                DB: {error || data?.health?.db !== 'connected' ? '?? Unknown' : '?? Connected'}
                </span>
            </div>
            <span className="text-xs text-gray-500 font-mono">Last verified: {lastVerified || 'Never'}</span>
          </div>
        </div>

        {/* Financial Metrics */}
        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-4">FINANCIAL</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard 
            title="Payments Today" 
            value={error || data?.paymentsToday === undefined ? 'Unknown' : formatRupees(data.paymentsToday)} 
            explanation="The total value of all successfully committed loan and chit payments today."
            status={error || data?.paymentsToday === undefined ? '?? Offline' : '?? Healthy'}
          />
          <MetricCard 
            title="Active Loans" 
            value={error || data?.activeLoans === undefined ? 'Unknown' : data.activeLoans.toLocaleString()} 
            explanation="Number of loans currently in repayment status."
          />
          <MetricCard 
            title="Ledger Gap" 
            value={error || data?.ledgerBalanced === null ? 'Unknown' : (data.ledgerBalanced ? '?0' : 'Discrepancy')} 
            status={error || data?.ledgerBalanced === null ? '?? Offline' : (data.ledgerBalanced ? '?? Healthy' : '?? Critical')}
            explanation="Difference between total system Debits and Credits. ?0 means the reconciliation engine currently finds no mathematical imbalance."
          />
          <MetricCard 
            title="Critical Incidents" 
            value={error || data?.criticalIncidents === undefined ? 'Unknown' : data.criticalIncidents.toString()} 
            status={error || data?.criticalIncidents === undefined ? '?? Offline' : (data.criticalIncidents === 0 ? '?? Healthy' : '?? Critical')}
            explanation="Open financial reconciliation mismatches requiring immediate investigation."
          />
        </div>

        {/* Infrastructure */}
        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-4">INFRASTRUCTURE</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard 
            title="API P95 Latency" 
            value={error || !data?.health?.apiP95 ? 'Unknown' : `${data.health.apiP95} ms`} 
            status={error || !data?.health?.apiP95 ? '?? Offline' : '?? Healthy'}
            explanation="This measures how quickly the server responds to requests. Source: Backend metrics."
          />
          <MetricCard 
            title="Database Connection" 
            value={error || !data?.health?.dbConnections ? 'Unknown' : `${data.health.dbConnections} / 60`} 
            status={error || data?.health?.db !== 'connected' ? '?? Offline' : '?? Healthy'}
            explanation="Active connections to MongoDB Atlas versus maximum allowed pool size."
          />
          <MetricCard 
            title="Financial Kill Switch" 
            value={error || data?.killSwitchEnabled === undefined ? 'Unknown' : (data.killSwitchEnabled ? 'ON' : 'OFF')} 
            status={error || data?.killSwitchEnabled === undefined ? '?? Offline' : (data.killSwitchEnabled ? '?? Critical' : '?? Healthy')}
            explanation="When ON, financial mutations are blocked across the backend. Customer history and other permitted read-only operations remain available."
          />
        </div>
      </div>
    </div>
  );
}
