"use client";
import React, { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ExplanationPopover } from '@/components/ui/ExplanationPopover';
import { MetricCard } from '@/components/ui/MetricCard';

export default function InfraCommandCenter() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchInfra = async () => {
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
    fetchInfra();
    const interval = setInterval(fetchInfra, 5000); // 5-second polling for infrastructure
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) return <div className="min-h-screen flex items-center justify-center">Loading infrastructure data...</div>;

  const dbStatus = data?.infrastructure?.database?.status;
  const dbLatency = data?.infrastructure?.database?.latencyMs;
  const redisStatus = data?.infrastructure?.redis?.status;
  const redisLatency = data?.infrastructure?.redis?.latencyMs;
  
  const httpLatency = data?.health?.http?.latency;
  const httpStats = data?.health?.http;
  
  const server = data?.infrastructure?.server;
  const websockets = data?.infrastructure?.websockets;

  const formatMemory = (bytes: number) => (bytes / 1024 / 1024).toFixed(2) + ' MB';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${error || dbStatus !== 'CONNECTED' ? 'border-red-500' : 'border-green-500'}`}>
          <h1 className="text-2xl font-bold text-gray-900">KHATHA INFRASTRUCTURE</h1>
          <p className={`text-sm font-medium mt-1 ${error || dbStatus !== 'CONNECTED' ? 'text-red-700' : 'text-green-700'}`}>
            {error ? '?? UNABLE TO REACH BACKEND' : (dbStatus === 'CONNECTED' ? '?? ALL CORE SYSTEMS OPERATIONAL' : '?? CRITICAL INFRASTRUCTURE DEGRADED')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex justify-between items-center">
              MongoDB (Atlas)
              <StatusBadge status={dbStatus === 'CONNECTED' ? '🟢 Healthy' : '🔴 Offline'} text="" />
            </h2>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between bg-gray-50 p-2 rounded border">
                <span>Latency</span>
                <span className="font-bold">{dbLatency !== undefined ? `${dbLatency} ms` : 'Unknown'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex justify-between items-center">
              Redis (Upstash)
              <StatusBadge status={redisStatus === 'READY' ? '🟢 Healthy' : '🔴 Offline'} text="" />
            </h2>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between bg-gray-50 p-2 rounded border">
                <span>Latency</span>
                <span className="font-bold">{redisLatency !== undefined ? `${redisLatency} ms` : 'Unknown'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Node.js API Server</h2>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between bg-gray-50 p-2 rounded border">
                <span>PM2 Workers</span>
                <span className="font-bold">{server?.pm2Workers || 1}</span>
              </div>
              <div className="flex justify-between bg-gray-50 p-2 rounded border">
                <span>CPU Cores</span>
                <span className="font-bold">{server?.cpuCount || 'Unknown'}</span>
              </div>
              <div className="flex justify-between bg-gray-50 p-2 rounded border">
                <span>Memory (RSS)</span>
                <span className="font-bold">{server?.memory?.rss ? formatMemory(server.memory.rss) : 'Unknown'}</span>
              </div>
              <div className="flex justify-between bg-gray-50 p-2 rounded border">
                <span>Uptime</span>
                <span className="font-bold">{server?.uptime ? Math.floor(server.uptime / 60) + ' min' : 'Unknown'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">HTTP & WebSocket Traffic</h2>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between bg-gray-50 p-2 rounded border">
                <span>WebSocket Connections</span>
                <span className="font-bold">{websockets?.activeConnections || 0}</span>
              </div>
              <div className="flex justify-between bg-gray-50 p-2 rounded border">
                <span>Active HTTP Requests</span>
                <span className="font-bold">{httpStats?.active || 0}</span>
              </div>
              <div className="flex justify-between bg-gray-50 p-2 rounded border">
                <span>5xx Error Count</span>
                <span className="font-bold text-red-600">{httpStats?.['5xx'] || 0}</span>
              </div>
              <div className="flex justify-between bg-gray-50 p-2 rounded border">
                <span>Latency (P50 / P95 / P99)</span>
                <span className="font-bold">
                  {httpLatency?.p50 ? Math.round(httpLatency.p50) : 0}ms / {httpLatency?.p95 ? Math.round(httpLatency.p95) : 0}ms / {httpLatency?.p99 ? Math.round(httpLatency.p99) : 0}ms
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
