import React from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function TransactionExplorer() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Transaction Explorer</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ledger</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">TX-918273</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">?5,000.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><StatusBadge status="🟢 Healthy" text="SUCCESS" /></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">BALANCED</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
