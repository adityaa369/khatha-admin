"use client";
import React, { useState, useEffect } from 'react';
import { MetricCard } from '@/components/ui/MetricCard';

export default function SecurityTelemetry() {
  const [overview, setOverview] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSecurity = async () => {
    try {
      const [overviewRes, eventsRes] = await Promise.all([
        fetch('/api/admin/security/overview'),
        fetch('/api/admin/security/events')
      ]);
      
      if (overviewRes.status === 401) {
         window.location.href = '/login';
         return;
      }

      if (overviewRes.ok && eventsRes.ok) {
        const oData = await overviewRes.json();
        const eData = await eventsRes.json();
        setOverview(oData.data);
        setEvents(eData.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurity();
    const interval = setInterval(fetchSecurity, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !overview) return <div className="min-h-screen flex items-center justify-center">Loading security telemetry...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h1 className="text-2xl font-bold text-gray-900">SECURITY TELEMETRY</h1>
          <p className="text-sm font-medium mt-1 text-gray-600">
            Append-only Audit and Threat Intelligence Store
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <MetricCard 
            title="Blocked Threats" 
            value={overview?.blockedRequests?.toString() || '0'} 
            status="🟢 Healthy"
            explanation="Number of malicious requests intercepted and blocked before hitting financial logic."
          />
          <MetricCard 
            title="OTP Replays" 
            value={overview?.otpReplays?.toString() || '0'} 
            status={overview?.otpReplays > 0 ? "🔴 Critical" : "🟢 Healthy"}
            explanation="Attempts to reuse a consumed or expired OTP."
          />
          <MetricCard 
            title="Rate Limit Breaches" 
            value={overview?.rateLimits?.toString() || '0'} 
            status={overview?.rateLimits > 0 ? "🟡 Attention" : "🟢 Healthy"}
            explanation="IPs or Users exceeding designated RPM limits."
          />
          <MetricCard 
            title="Critical Incidents" 
            value={overview?.criticalIncidents?.toString() || '0'} 
            status={overview?.criticalIncidents > 0 ? "🔴 Critical" : "🟢 Healthy"}
            explanation="Severity: CRITICAL events requiring manual intervention."
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">Recent Security Events</h2>
            <div className="text-xs text-gray-500 font-mono">Real-time (append-only)</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">Timestamp</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">Type & Severity</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">Actor</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">Target Route</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">Result</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">Financial Impact</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 font-mono">
                {events.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">No events found in audit log.</td></tr>
                ) : (
                  events.map((e, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                        {new Date(e.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{e.eventType}</div>
                        <div className={`text-xs mt-1 ${
                          e.severity === 'CRITICAL' ? 'text-red-600 font-bold' : 
                          e.severity === 'HIGH' ? 'text-orange-500' : 'text-gray-500'
                        }`}>{e.severity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">{e.actorType}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[150px]">{e.actorId || 'Anonymous'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900 truncate max-w-[200px]">{e.route || 'N/A'}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[150px]">IP: {e.ipReference || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          e.result === 'BLOCKED' ? 'bg-red-100 text-red-800' :
                          e.result === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {e.result}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{e.financialImpact}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {e.reachedFinancialLogic ? '🔴 Reached Core' : '🟢 Blocked at Edge'}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
