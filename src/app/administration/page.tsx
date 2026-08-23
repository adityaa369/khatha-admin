
import React from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function AdministrationCenter() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Administration & Audit Center</h1>
        
        {/* Admin Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">ADMINISTRATORS</h2>
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="text-left text-gray-500 uppercase">
                <th className="py-2">Admin ID</th>
                <th className="py-2">Role</th>
                <th className="py-2">Status</th>
                <th className="py-2">MFA</th>
                <th className="py-2">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 font-mono font-bold text-gray-900">OPS-291</td>
                <td className="py-3 font-medium text-gray-700">Operations Admin</td>
                <td className="py-3"><StatusBadge status="🟢 Healthy" text="Active" /></td>
                <td className="py-3"><StatusBadge status="🟢 Healthy" text="Enabled" /></td>
                <td className="py-3 text-gray-500">14:39 TODAY</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Role Permissions Map */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Role: OPS_ADMIN</h2>
          <div className="grid grid-cols-2 gap-8 text-sm bg-gray-50 p-4 rounded border">
            <div>
              <strong className="text-green-700 block mb-2">Can:</strong>
              <ul className="space-y-1 text-gray-700">
                <li>? View infrastructure & customers</li>
                <li>? Investigate & resolve incidents</li>
                <li>? Activate kill switch</li>
              </ul>
            </div>
            <div>
              <strong className="text-red-700 block mb-2">Cannot:</strong>
              <ul className="space-y-1 text-gray-700">
                <li>? Modify financial balances</li>
                <li>? View unrestricted KYC without MFA/Reason</li>
                <li>? Delete Audit Logs</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Audit Log */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Admin Audit Center</h2>
          <div className="space-y-4 border-l-2 border-gray-200 ml-2 pl-4">
            <div>
              <p className="text-xs font-mono text-gray-500">14:32:12 TODAY | REQ-82931</p>
              <p className="font-bold text-gray-900">ENABLE_KILL_SWITCH</p>
              <p className="text-sm text-gray-600 mt-1">Admin: <span className="font-mono">OPS-291 (OPS_ADMIN)</span></p>
              <p className="text-sm bg-gray-100 p-2 rounded mt-2 font-mono">Reason: "Ledger reconciliation discrepancy"</p>
              <p className="text-sm font-medium text-green-700 mt-1">Result: SUCCESS</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
