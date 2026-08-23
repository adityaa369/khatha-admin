
import React from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ExplanationPopover } from '@/components/ui/ExplanationPopover';

export default function InfraCommandCenter() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <h1 className="text-2xl font-bold text-gray-900">KHATHA INFRASTRUCTURE</h1>
          <p className="text-sm font-medium text-green-700 mt-1">?? ALL SYSTEMS OPERATIONAL</p>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Component</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Meaning</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900">API</td>
                <td className="px-6 py-4"><StatusBadge status="🟢 Healthy" text="??" /></td>
                <td className="px-6 py-4 text-gray-600">Requests being served (Liveness: OK, Readiness: OK)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900 flex items-center">MongoDB</td>
                <td className="px-6 py-4"><StatusBadge status="🟢 Healthy" text="??" /></td>
                <td className="px-6 py-4 text-gray-600">Database connected (Authoritative Ledger)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900">Redis</td>
                <td className="px-6 py-4"><StatusBadge status="🟢 Healthy" text="??" /></td>
                <td className="px-6 py-4 text-gray-600">Cache/coordination available</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900">Backups</td>
                <td className="px-6 py-4"><StatusBadge status="🟡 Attention" text="??" /></td>
                <td className="px-6 py-4 text-gray-600">Latest backup available, but RPO Target Missed</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Component Impact UI */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">MongoDB (Atlas)</h2>
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded border font-mono text-sm mb-4">
               <span>Active Connections</span>
               <span><span className="font-bold">31</span> / 60</span>
            </div>
            <div className="text-sm">
              <p className="font-bold text-gray-900 mb-2">If MongoDB goes offline:</p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>?? Financial Ledger unavailable</li>
                <li>?? Authoritative Chit state unavailable</li>
                <li>?? Login / Auth blocked</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              Redis
              <ExplanationPopover title="Redis Coordination" meaning="Redis handles ephemeral state, rate limits, and Socket.IO Pub/Sub. It is NEVER the financial authority." />
            </h2>
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded border font-mono text-sm mb-4">
               <span>Latency</span>
               <span className="font-bold text-green-700">4 ms</span>
            </div>
            <div className="text-sm">
              <p className="font-bold text-gray-900 mb-2">If Redis goes offline:</p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1 mb-2">
                <li>?? Rate limiting & Pub/Sub unavailable</li>
                <li>?? WebSocket synchronisation interrupted</li>
              </ul>
              <div className="bg-green-50 text-green-800 p-2 rounded mt-2 text-xs">
                <strong>?? SAFE:</strong> Financial ledger & historical records are unaffected. MongoDB remains the financial authority.
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
